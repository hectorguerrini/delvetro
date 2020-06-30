import { Injectable } from '@angular/core';
import { AuthService } from 'ngx-auth';
import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccessData } from 'src/app/shared/models/accessData';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService implements AuthService {
	url = environment.url;
	constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }
	/**
	 * Check, if user already authorized.
	 * @description Should return Observable with true or false values
	 * @returns {Observable<boolean>}
	 * @memberOf AuthService
	 */
	public isAuthorized(): Observable<boolean> {
		return this.tokenStorage
			.getAccessToken()
			.pipe(map(token => !!token));
	}

	/**
	 * Get access token
	 * @description Should return access token in Observable from e.g.
	 * localStorage
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {
		return this.tokenStorage.getAccessToken();
	}

	/**
	 * Function, that should perform refresh token verifyTokenRequest
	 * @description Should be successfully completed so interceptor
	 * can execute pending requests or retry original one
	 * @returns {Observable<any>}
	 */
	public refreshToken(): Observable<AccessData> {
		return this.tokenStorage
			.getRefreshToken()
			.pipe(
				switchMap((refreshToken: string) =>
					this.http.post(`${environment.url}/refreshToken`, { refreshToken })
				),
				tap((tokens: AccessData) => this.saveAccessData(tokens)),
				catchError((err) => {
					this.logout();

					return Observable.throw(err);
				})
			);
	}

	/**
	 * Function, checks response of failed request to determine,
	 * whether token be refreshed or not.
	 * @description Essentialy checks status
	 * @param {Response} response
	 * @returns {boolean}
	 */
	public refreshShouldHappen(response: HttpErrorResponse): boolean {
		return response.status === 401;
	}

	/**
	 * Verify that outgoing request is refresh-token,
	 * so interceptor won't intercept this request
	 * @param url de acesso
	 * @returns retona se foi possivel dar refresh
	 */
	public verifyTokenRequest(url: string): boolean {
		return url.endsWith('/refreshToken');
	}

	/**
	 * EXTRA AUTH METHODS
	 */

	public login(usuario): Observable<any> {
		return this.http.post(`${environment.url}/login`, usuario)
			.pipe(
				tap((tokens: AccessData) => {
					this.setIdUsuario(tokens.id_usuario);
					this.saveAccessData(tokens);
				})
			);
	}
	/**
	 * Logout
	 */
	public logout(): void {
		this.tokenStorage.clear();
		location.reload(true);
	}

	private saveAccessData({ accessToken, refreshToken }: AccessData) {
		this.tokenStorage
			.setAccessToken(accessToken)
			.setRefreshToken(refreshToken);
	}

	public setIdUsuario(id: string) {
		localStorage.setItem('id_usuario', id);
		return this;
	}
	public getIdUsuario(): Observable<string> {
		const token: string = <string>localStorage.getItem('id_usuario');
		return of(token);
	}

}
