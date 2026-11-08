import React from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Navbar = () => {
	const educatorData = dummyEducatorData;
	const { user, logout } = useAppContext();
	return (
		<div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
			<Link to="/">
				<img src={assets.logo} alt="logo" className="w-28 lg:w-32" />
			</Link>

			<div className="flex items-center gap-5 text-gray-500 relative">
				<p>Hi! {user ? user.name : "Developers"} </p>
				{user ? (
					<div className="relative group">
						<img
							className="w-8 h-8 rounded-full cursor-pointer"
							src={user.imageUrl || assets.profile_img}
							alt="profile"
						/>
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
							<button
								onClick={logout}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Logout
							</button>
						</div>
					</div>
				) : (
					<img className="max-w-8" src={assets.profile_img} alt="profile_img" />
				)}
			</div>
		</div>
	);
};

export default Navbar;
