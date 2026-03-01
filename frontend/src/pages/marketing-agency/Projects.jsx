import { useState } from 'react';
import MarketingSidebar from '../../components/marketing-agency/MarketingSidebar';
import StatCard from '../../components/marketing-agency/StatCard';
import ProjectCard from '../../components/marketing-agency/ProjectCard';
import './Projects.css';

const Projects = () => {
    const stats = [
        { title: 'Total Startups', value: '12' },
        { title: 'Active Projects', value: '06' },
        { title: 'Total Funding raised', value: '$22,000' }
    ];

    const projectsData = [
        {
            id: 1,
            initials: 'TK',
            name: 'Team Kathaa',
            type: 'Saas',
            progress: 75,
            budget: '2500',
            teamSize: 8
        },
        {
            id: 2,
            initials: 'TK',
            name: 'Team Kathaa',
            type: 'Saas',
            progress: 75,
            budget: '2500',
            teamSize: 8
        },
        {
            id: 3,
            initials: 'TK',
            name: 'Team Kathaa',
            type: 'Saas',
            progress: 75,
            budget: '2500',
            teamSize: 8
        },
        {
            id: 4,
            initials: 'TK',
            name: 'Team Kathaa',
            type: 'Saas',
            progress: 75,
            budget: '2500',
            teamSize: 8
        },
        {
            id: 5,
            initials: 'TK',
            name: 'Team Kathaa',
            type: 'Saas',
            progress: 75,
            budget: '2500',
            teamSize: 8
        }
    ];

    return (
        <div className="marketing-projects-layout">
            <MarketingSidebar />

            <main className="marketing-main-content">
                <div className="projects-header">
                    <h1 className="page-title">Projects</h1>

                    <div className="search-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>
                </div>

                <div className="stats-row">
                    {stats.map((stat, index) => (
                        <StatCard key={index} title={stat.title} value={stat.value} />
                    ))}
                </div>

                <div className="projects-grid">
                    {projectsData.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Projects;
