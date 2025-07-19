"use client";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    logout();
    closeDropdown();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown} 
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img
            width={44}
            height={44}
            src="/images/user/owner.jpg"
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.name || user?.email || 'User'}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="w-62.5"
      >
        <DropdownItem>
          <Link to="/profile" className="flex items-center gap-2.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_130_9814)">
                <path
                  d="M9.0002 7.82187C10.5189 7.82187 11.7377 6.60312 11.7377 5.08437C11.7377 3.56562 10.5189 2.34687 9.0002 2.34687C7.48145 2.34687 6.2627 3.56562 6.2627 5.08437C6.2627 6.60312 7.48145 7.82187 9.0002 7.82187Z"
                  fill=""
                />
                <path
                  d="M10.8283 9.05627H7.17207C4.16257 9.05627 1.71582 11.5219 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219H15.6377C16.0033 17.5219 16.2846 17.2406 16.2846 16.875V14.5406C16.2846 11.5219 13.8378 9.05627 10.8283 9.05627Z"
                  fill=""
                />
              </g>
              <defs>
                <clipPath id="clip0_130_9814">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
            My Profile
          </Link>
        </DropdownItem>
        <DropdownItem>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.0002 7.82187C10.5189 7.82187 11.7377 6.60312 11.7377 5.08437C11.7377 3.56562 10.5189 2.34687 9.0002 2.34687C7.48145 2.34687 6.2627 3.56562 6.2627 5.08437C6.2627 6.60312 7.48145 7.82187 9.0002 7.82187Z"
                fill=""
              />
              <path
                d="M10.8283 9.05627H7.17207C4.16257 9.05627 1.71582 11.5219 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219H15.6377C16.0033 17.5219 16.2846 17.2406 16.2846 16.875V14.5406C16.2846 11.5219 13.8378 9.05627 10.8283 9.05627Z"
                fill=""
              />
            </svg>
            Sign Out
          </button>
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
