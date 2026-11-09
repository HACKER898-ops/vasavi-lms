import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser, useClerk } from "@clerk/clerk-react";

export const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppContextProvider");
    }
    return context;
};

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const { getToken, isSignedIn } = useAuth();
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();

    const [allCourses, setAllCourses] = useState([]);
    const [isCoursesLoading, setIsCoursesLoading] = useState(true);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);

    // Same shape your Navbar already expects: user.name, user.imageUrl
    const user = useMemo(() => {
        if (!isSignedIn || !clerkUser) return null;
        return {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || "User",
            imageUrl: clerkUser.imageUrl,
            email: clerkUser.primaryEmailAddress?.emailAddress,
        };
    }, [isSignedIn, clerkUser]);

    // Logout via Clerk
    const logout = async () => {
        await signOut();
        setUserData(null);
        setEnrolledCourses([]);
        setIsEducator(false);
        navigate("/");
        toast.success("Logged out successfully");
    };

    // fetch all courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/course/all");
            if (data.success) {
                setAllCourses(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsCoursesLoading(false);
        }
    };

    // fetch user data
    const fetchUserData = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const { data } = await axios.get(backendUrl + "/api/user/data", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating;
        });
        return Math.floor(totalRating / course.courseRatings.length);
    };

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // Function to calculate course duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) =>
            chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
        );
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // Function to calculate number of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    };

    // Fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const response = await axios.get(backendUrl + "/api/user/enrolled-courses", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.enrolledCourses) {
                setEnrolledCourses(response.data.enrolledCourses.reverse());
            } else {
                toast.error(response.data?.message || "No enrolled courses found.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Load courses once
    useEffect(() => {
        fetchAllCourses();
    }, []);

    // When the Clerk session changes, load (or clear) the user's data
    useEffect(() => {
        if (isSignedIn && clerkUser) {
            setIsEducator(clerkUser.publicMetadata?.role === "educator");
            fetchUserData();
            fetchUserEnrolledCourses();
        } else {
            setUserData(null);
            setEnrolledCourses([]);
            setIsEducator(false);
        }
    }, [isSignedIn, clerkUser?.id]);

    const value = {
        currency, allCourses, isCoursesLoading, navigate, isEducator, setIsEducator,
        calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,
        fetchUserEnrolledCourses, setEnrolledCourses, enrolledCourses, backendUrl,
        userData, setUserData, getToken, fetchAllCourses,
        user, logout,
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};