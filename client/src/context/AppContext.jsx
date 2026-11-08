import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
import axios from 'axios'
import {  toast } from 'react-toastify';

export const AppContext = createContext()

// Custom hook to use the AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppContextProvider');
    }
    return context;
}

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log('🌐 Backend URL configured as:', backendUrl);

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    // Login function
    const login = async (username, password) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/login', { username, password });
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                toast.success('Login successful!');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Register function
    const register = async (username, email, password, name) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/register', { username, email, password, name });
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                toast.success('Registration successful!');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        setToken('');
        setUser(null);
        setUserData(null);
        setEnrolledCourses([]);
        localStorage.removeItem('token');
        navigate('/');
        toast.success('Logged out successfully');
    };

    // Get token for API calls
    const getToken = async () => {
        return token;
    };

    // fetch all courses 
    const fetchAllCourses = async ()=>{
        // setAllCourses(dummyCourses)
        try {
            console.log('🔍 Fetching courses from:', backendUrl + '/api/course/all');
            const {data} = await axios.get(backendUrl + '/api/course/all');
            console.log('📦 Response received:', data);
            if(data.success)
            {
                setAllCourses(data.courses)
                console.log('✅ Courses loaded:', data.courses.length);
            }else{
                console.error('❌ API Error:', data.message);
                toast.error(data.message);
            }
            
        } catch (error) {
            console.error('❌ Fetch Error:', error);
            toast.error(error.message)
        }
    }

    // fetch user data
    const fetchUserData = async ()=>{
        if (!token) return;

        try {
            const {data} = await axios.get(backendUrl + '/api/user/data' , {headers: {Authorization: `Bearer ${token}`}})
        
            if(data.success){
                setUserData(data.user)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating;
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    // Function to calculate course Duratuion
    const calculateCourseDuration = (course)=>{
        let time = 0 ;
        course.courseContent.map((chapter)=> chapter.chapterContent.map(
            (lecture)=> time += lecture.lectureDuration 
        ))

        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]}) 
    }

    // Function to calculate to no. of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // Fetch user enrolled courses

    // const fetchUserEnrolledCourses = async()=>{
    //     // setEnrolledCourses(dummyCourses)
    //    try {
    //     const token = await getToken();

    //     const data = await axios.get(backendUrl + '/api/user/enrolled-courses', {headers: {Authorization: `Bearer ${token}`}})
        
    //     console.log("Data",data);
    //     if(data){
    //         setEnrolledCourses(data.enrolledCourses.reverse());
    //         // console.log("enroll", enrolledCourses);
    //         // console.log("setenroll", enrolledCourses);
            
    //     }else{
    //         toast.error(data.message)
    //     }
    //    } catch (error) {
    //     toast.error(error.message)
    //    }
    // }


    const fetchUserEnrolledCourses = async () => {
        if (!token) return;
        
        try {
            const response = await axios.get(backendUrl + "/api/user/enrolled-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // console.log("Response:", response); // Debugging: Log full response
    
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
    
    // Load user from token on mount
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const { data } = await axios.get(backendUrl + '/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        // Invalid token, clear it
                        localStorage.removeItem('token');
                        setToken('');
                    }
                } catch (error) {
                    console.error('Failed to load user:', error);
                    localStorage.removeItem('token');
                    setToken('');
                }
            }
        };
        loadUser();
        fetchAllCourses();
    }, []);

    useEffect(()=>{
        if(token && user){
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    },[token, user])

    const value = {
        currency,allCourses, navigate, isEducator, setIsEducator,
        calculateRating,calculateChapterTime,calculateCourseDuration,calculateNoOfLectures
        ,fetchUserEnrolledCourses, setEnrolledCourses,enrolledCourses,backendUrl, userData, setUserData, getToken, fetchAllCourses,
        token, setToken, user, setUser, login, register, logout
    }


    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )

    

}