import React from "react";
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {

    return(
        <div className="home">
            <h1 className="header">ATTENDANCE MANAGEMENT SYSTEM</h1>
            <div className="container">
                <Link to={"https://attendance-management-system-wkx2.vercel.app/"}>
                <button className="btn">Admin</button>
                </Link>
                <Link to={"https://attendance-management-system-bdnw.vercel.app/"}>
                <button className="btn">Faculty</button>
                </Link>
                <Link to={"https://attendance-management-system-sable-ten.vercel.app/"}>
                <button className="btn">Student</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;