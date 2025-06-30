export const API_CONFIG = {
    BASE_URL: 'https://mail-staging.gnuweeb.org/api.php',
}

// Types for API responses
export interface LoginRequest {
    user: string;
    pass: string;
}

export interface UserInfo {
    id: number;
    full_name: string;
    gender: string;
    username: string;
    ext_email: string;
    role: string;
    is_active: string;
    socials: {
        github_username: string;
        telegram_username: string;
        twitter_username: string;
        discord_username: string;
    };
    photo: string | null;
}

export interface LoginResponse {
    code: number;
    res: {
        msg: string;
        token: string;
        token_exp_at: number;
        user_info: UserInfo;
    };
}

export interface RefreshUserInfoResponse {
    code: number;
    res: {
        msg: string;
        user_info: UserInfo;
        renew_token: {
            token: string;
            token_exp_at: number;
        };
    };
}

export interface ApiError {
    code: number;
    message: string;
}

// API service class
export class ApiService {
    private static instance: ApiService;
    private token: string | null = null;
    
    private constructor() {}
    
    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }
    
    // Set authentication token
    public setToken(token: string): void {
        this.token = token;
    }
    
    // Get current token
    public getToken(): string | null {
        return this.token;
    }
    
    // Clear authentication token
    public clearToken(): void {
        this.token = null;
    }
    
    // Generic API request method
    private async makeRequest<T>(
        action: string,
        data?: any,
        method: 'GET' | 'POST' = 'POST'
    ): Promise<T> {
        const url = `${API_CONFIG.BASE_URL}?action=${action}`;
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        // Add authorization header if token exists
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const config: RequestInit = {
            method,
            headers,
        };
        
        if (method === 'POST' && data) {
            config.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, config);
            const result = await response.json();
            
            // Check if the response indicates an error
            if (result.code && result.code !== 200) {
                throw new Error(result.res?.msg || 'An error occurerred');
            }
            
            return result as T;
        } catch (error) {
            throw error;
        }
    }
    
    // Login method
    public async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.makeRequest<LoginResponse>('login', credentials);
        
        // Store the token for future requests
        if (response.res?.token) {
            this.setToken(response.res.token);
        }
        
        return response;
    }
    
    // Refresh user info and token method
    public async refreshUserInfo(): Promise<RefreshUserInfoResponse> {
        const response = await this.makeRequest<RefreshUserInfoResponse>('get_user_info&renew_token=1', undefined, 'GET');
        
        // Update the token for future requests
        if (response.res?.renew_token?.token) {
            this.setToken(response.res.renew_token.token);
        }
        
        return response;
    }
    
    // Logout method
    public async logout(): Promise<void> {
        try {
            // await this.makeRequest('logout');
            this.clearToken();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    // Check if user is authenticated
    public isAuthenticated(): boolean {
        return this.token !== null;
    }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

