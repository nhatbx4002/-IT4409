

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

export const getUser = (): AuthUser | null => {
    try {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null
    }
}

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY) && !!getUser();
}

export const loginMock = (user?: Partial<AuthUser>) => {
    localStorage.setItem(TOKEN_KEY, 'mock-token');
    const mockUser: AuthUser = {
        id: '1',
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        avatarUrl: user?.avatarUrl ||  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=256&q=80&auto=format&fit=crop",
    };
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}