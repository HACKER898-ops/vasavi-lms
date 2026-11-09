import { SignUp } from "@clerk/clerk-react";

const Signup = () => (
    <div className="flex justify-center items-center min-h-[80vh]">
        <SignUp routing="path" path="/signup" signInUrl="/login" fallbackRedirectUrl="/" />
    </div>
);

export default Signup;