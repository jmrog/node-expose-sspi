import { IncomingMessage, ServerResponse } from 'http';

export interface SSOObject {
  user?: User;
  owner?: User;
  method?: SSOMethod;
  cached?: boolean;
}

declare module 'http' {
  interface IncomingMessage {
    /**
     * Contains the SSOObject.
     *
     * @type {SSOObject}
     * @memberof Request
     */
    sso: SSOObject;
  }
}

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) => void;

export type CookieToken = string;

export type MessageType =
  | 'Unknown'
  | 'NTLM_NEGOTIATE_01'
  | 'NTLM_CHALLENGE_02'
  | 'NTLM_AUTHENTICATE_03'
  | 'Kerberos_1'
  | 'Kerberos_N';

export type NextFunction = (error?: Error) => void | Promise<void>;

/**
 * options to provide to sso.auth() and SSO.setOptions().
 *
 * @export
 * @interface AuthOptions
 */
export interface AuthOptions {
  /**
   * Brings back the groups the user belongs to.
   *
   * @default true
   *
   * @type {boolean}
   * @memberof AuthOptions
   */
  useGroups?: boolean;

  /**
   * Brings back the Active Directory user information
   *
   * Note 1: only if we can reach Active Directory of the Domain Controller
   *
   * @default true
   *
   * @type {boolean}
   * @memberof AuthOptions
   */
  useActiveDirectory?: boolean;

  /**
   * Brings back the server process owner info.
   *
   * @default false
   *
   * @type {boolean}
   * @memberof AuthOptions
   */
  useOwner?: boolean;

  /**
   * Manage authentication with cookie.
   * Useful for performance when many users try to connect at the same time.
   *
   * @default true
   *
   * @type {boolean}
   * @memberof AuthOptions
   */
  useCookies?: boolean;

  /**
   * Filter the groups. Useful if there are too much groups to fetch.
   *
   * @default ".*"
   *
   * @type {string}
   * @memberof AuthOptions
   */
  groupFilterRegex?: string;

  /**
   * If true, someone that connects with wrong login/password may be
   * authenticated as Windows guest user.
   *
   * @default false
   *
   * @type {boolean}
   * @memberof AuthOptions
   */
  allowsGuest?: boolean;

  /**
   * If true, someone that connects without login/password may be
   * authenticated as Windows anonymous user account.
   *
   * @default false
   *
   * @type {boolean}
   * @memberof AuthOptions
   */
  allowsAnonymousLogon?: boolean;

  /**
   * If true, cache the req.sso into req.session.sso.
   * module `express-session` should be used.
   * Add an `cached` attribute in the req.session.sso object
   * indicating if the object was already cached.
   *
   * @default false
   *
   * @type {boolean}
   * @memberof AuthOptions
   */
  useSession?: boolean;
}

export interface User {
  name?: string;
  sid?: string;
  displayName?: string;
  domain?: string;
  groups?: string[];
  adUser?: ADUser;
}

export interface Database {
  users: ADUsers;
}

export interface ADUser {
  sn?: string;
  givenName?: string;
  cn?: string;
  [key: string]: any;
}

export type ADUsers = ADUser[];

export interface CookieList {
  [name: string]: string;
}

export type SSOMethod = 'NTLM' | 'Kerberos' | undefined;
