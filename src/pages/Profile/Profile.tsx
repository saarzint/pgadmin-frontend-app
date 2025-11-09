import React, { useState } from 'react';
import {
  ProfileHeader,
  AcademicInformation,
  StandardizedTests,
  ExtracurricularActivities,
  AwardsHonors,
} from '../../components/Profile';
import type { AcademicRecord } from '../../components/Profile/AcademicInformation/AcademicInformation';
import type { TestScore } from '../../components/Profile/StandardizedTests/StandardizedTests';
import type { Activity } from '../../components/Profile/ExtracurricularActivities/ExtracurricularActivities';
import type { AwardHonor } from '../../components/Profile/AwardsHonors/AwardsHonors';

const Profile: React.FC = () => {
  // Profile state
  const [profileName, setProfileName] = useState('John Doe');
  const [profileQuote, setProfileQuote] = useState(
    'Aspiring to make a difference in the world through education'
  );

  // Academic records state
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      gpa: '3.9',
      maxGpa: '4.0',
      startDate: '2020-09',
      endDate: '2024-05',
      grades: '95%',
    },
  ]);

  // Test scores state
  const [testScores, setTestScores] = useState<TestScore[]>([
    {
      id: '1',
      testType: 'SAT',
      score: '1520',
      maxScore: '1600',
      testDate: '2023-12-15',
    },
    {
      id: '2',
      testType: 'TOEFL',
      score: '110',
      maxScore: '120',
      testDate: '2024-01-20',
      expiryDate: '2026-01-20',
    },
  ]);

  // Activities state
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Debate Team Captain',
      organization: 'UC Berkeley',
      role: 'Team Captain & Lead Debater',
      category: 'Leadership',
      startDate: '2021-09',
      endDate: '2024-05',
      isOngoing: false,
      description:
        'Led a team of 15 members to win regional championships. Organized weekly practice sessions and mentored junior members.',
      hoursPerWeek: '10',
      weeksPerYear: '40',
    },
  ]);

  // Awards state
  const [awards, setAwards] = useState<AwardHonor[]>([
    {
      id: '1',
      title: 'Dean\'s List',
      issuer: 'UC Berkeley',
      category: 'Academic',
      level: 'School',
      dateReceived: '2023-05',
      description: 'Recognized for maintaining a GPA above 3.75 for three consecutive semesters.',
    },
  ]);

  // Handlers for Academic Records
  const handleAddAcademicRecord = (record: Omit<AcademicRecord, 'id'>) => {
    const newRecord: AcademicRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setAcademicRecords([...academicRecords, newRecord]);
  };

  const handleEditAcademicRecord = (id: string, record: Omit<AcademicRecord, 'id'>) => {
    setAcademicRecords(
      academicRecords.map((r) => (r.id === id ? { ...record, id } : r))
    );
  };

  const handleDeleteAcademicRecord = (id: string) => {
    setAcademicRecords(academicRecords.filter((r) => r.id !== id));
  };

  // Handlers for Test Scores
  const handleAddTestScore = (test: Omit<TestScore, 'id'>) => {
    const newTest: TestScore = {
      ...test,
      id: Date.now().toString(),
    };
    setTestScores([...testScores, newTest]);
  };

  const handleEditTestScore = (id: string, test: Omit<TestScore, 'id'>) => {
    setTestScores(testScores.map((t) => (t.id === id ? { ...test, id } : t)));
  };

  const handleDeleteTestScore = (id: string) => {
    setTestScores(testScores.filter((t) => t.id !== id));
  };

  // Handlers for Activities
  const handleAddActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities([...activities, newActivity]);
  };

  const handleEditActivity = (id: string, activity: Omit<Activity, 'id'>) => {
    setActivities(activities.map((a) => (a.id === id ? { ...activity, id } : a)));
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  // Handlers for Awards
  const handleAddAward = (award: Omit<AwardHonor, 'id'>) => {
    const newAward: AwardHonor = {
      ...award,
      id: Date.now().toString(),
    };
    setAwards([...awards, newAward]);
  };

  const handleEditAward = (id: string, award: Omit<AwardHonor, 'id'>) => {
    setAwards(awards.map((a) => (a.id === id ? { ...award, id } : a)));
  };

  const handleDeleteAward = (id: string) => {
    setAwards(awards.filter((a) => a.id !== id));
  };

  // Handler for Profile Update
  const handleUpdateProfile = (name: string, quote: string) => {
    setProfileName(name);
    setProfileQuote(quote);
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full px-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader
            name={profileName}
            quote={profileQuote}
            onUpdateProfile={handleUpdateProfile}
          />

          {/* Academic Information */}
          <AcademicInformation
            records={academicRecords}
            onAdd={handleAddAcademicRecord}
            onEdit={handleEditAcademicRecord}
            onDelete={handleDeleteAcademicRecord}
          />

          {/* Standardized Tests */}
          <StandardizedTests
            tests={testScores}
            onAdd={handleAddTestScore}
            onEdit={handleEditTestScore}
            onDelete={handleDeleteTestScore}
          />

          {/* Extracurricular Activities */}
          <ExtracurricularActivities
            activities={activities}
            onAdd={handleAddActivity}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />

          {/* Awards & Honors */}
          <AwardsHonors
            awards={awards}
            onAdd={handleAddAward}
            onEdit={handleEditAward}
            onDelete={handleDeleteAward}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
