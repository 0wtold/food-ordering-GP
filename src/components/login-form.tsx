import React from "react";
import { Card, CardBody, Input, Button, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/auth-context";

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  const { login, signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!isLogin && !displayName) {
      setError("Please enter your name");
      return;
    }
    
    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signUp(email, password, displayName);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Team Food Ordering System
          </h1>
          
          <Tabs 
            aria-label="Authentication options" 
            selectedKey={isLogin ? "login" : "signup"}
            onSelectionChange={(key) => setIsLogin(key === "login")}
            className="mb-6"
          >
            <Tab key="login" title="Login" />
            <Tab key="signup" title="Sign Up" />
          </Tabs>
          
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger p-3 rounded-medium mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onValueChange={setEmail}
              startContent={<Icon icon="lucide:mail" className="text-default-400" />}
              isRequired
            />
            
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={displayName}
                onValueChange={setDisplayName}
                startContent={<Icon icon="lucide:user" className="text-default-400" />}
                isRequired
              />
            )}
            
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onValueChange={setPassword}
              startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              isRequired
            />
            
            <Button 
              type="submit" 
              color="primary" 
              className="w-full"
              isLoading={loading}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
