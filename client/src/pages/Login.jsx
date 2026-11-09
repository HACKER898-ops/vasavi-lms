import { SignIn } from "@clerk/clerk-react";

const Login = () => (
    <div className="flex justify-center items-center min-h-[80vh]">
        <SignIn routing="path" path="/login" signUpUrl="/signup" fallbackRedirectUrl="/" />
    </div>
);

export default Login;