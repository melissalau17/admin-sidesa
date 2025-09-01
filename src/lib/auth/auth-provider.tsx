// Corrected Code
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

// Define a type for the data in your JWT token
interface DecodedToken {
    user_id: string;
    role: string;
    // ... add any other properties present in your token
}

interface User {
    user_id: string;
    username: string;
    nama: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean
    login: (token: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();

    const validateSession = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (token) {
            try {
                // Now, use the specific type for the decoded token
                const decoded: DecodedToken = jwtDecode(token);
                // Fetch full user data to populate the context
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${decoded.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userData: User = response.data.data;
                
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Session validation failed:", error);
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        validateSession();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const isPublicRoute = pathname === "/" || pathname === "/login";
            if (!isAuthenticated && !isPublicRoute) {
                router.push("/login");
            }
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    const login = async (token: string) => {
        localStorage.setItem("token", token);
        await validateSession(); // Re-validate session after login
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        router.push("/");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}