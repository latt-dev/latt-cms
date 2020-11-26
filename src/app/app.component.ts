import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { AuthDialogComponent } from './shared/ui/auth-dialog/auth-dialog.component';
import { AuthDialogResult } from './shared/ui/auth-dialog/auth-dialog.models';
import { RouteDataKeys } from './shared/models/route-data-keys.model';

@Component({
  selector: 'latt-root',
  templateUrl: './app.component.html',
  styles: ['.latt-root { height: 100vh; }', '.nav-item { padding-right: 8px; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenavContainer') sidenavContainer: any;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('toolbar') toolbar: MatToolbar;

  toolbarTitle = 'Latt CMS';

  navEntities = [
    { name: 'Home', path: 'home', restricted: false },
    { name: 'Users', path: 'users', restricted: true },
    { name: 'Paths', path: 'paths', restricted: true },
    { name: 'Courses', path: 'courses', restricted: true },
    { name: 'Articles', path: 'articles', restricted: true },
    { name: 'Labs', path: 'labs', restricted: true },
    { name: 'Questions', path: 'questions', restricted: true },
  ];

  isMobileResolution: boolean;
  mobileResolutionMatcher$ = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.HandsetPortrait]).pipe(
    tap(({ matches }) => {
      this.isMobileResolution = matches;
    })
  );

  private destroy$ = new Subject<void>();
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data[RouteDataKeys.title]) {
            return child.snapshot.data[RouteDataKeys.title];
          }
          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        const pageTitle = `Latt CMS - ${ttl}`;
        this.titleService.setTitle(pageTitle);
      });
    this.authService.checkAuthState();
  }

  ngAfterViewInit() {
    const toolbarHeight: number = this.toolbar._elementRef.nativeElement.offsetHeight;
    this.renderer.setStyle(this.sidenavContainer._element.nativeElement, 'height', `calc(100% - ${toolbarHeight}px)`);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  chooseNavItem() {
    if (this.isMobileResolution) {
      this.sidenav.toggle();
    }
  }

  handleAuthState(isAuthenticated: boolean) {
    if (isAuthenticated) {
      this.authService.signOut();
    } else {
      this.openSignInDialog();
    }
  }

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      data: { isExistingUser: true },
    });

    dialogRef.afterClosed().subscribe((result: AuthDialogResult) => {
      if (!result) {
        return;
      }
      result.isExistingUser
        ? this.authService.signIn(result).subscribe(console.log)
        : this.authService.signUp(result).subscribe(console.log);
    });
  }
}
