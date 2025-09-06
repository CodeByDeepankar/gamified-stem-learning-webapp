"use client";

import React, { useMemo, useState } from "react";
import { OfflineManager, type User } from "@/lib/db/database";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

type Role = "student" | "teacher";
type Mode = "register" | "login";

interface BaseFields {
  schoolIdOrName?: string;
  schoolId?: string;
  grade: string;
}

interface StudentRegister extends BaseFields {
  schoolIdOrName: string; // name or id as one field per user request
  name: string;
  studentId: string;
}

interface StudentLogin extends BaseFields {
  schoolIdOrName: string;
  studentId: string;
}

interface TeacherRegister extends BaseFields {
  schoolId: string;
  subject: string;
}

interface TeacherLogin extends BaseFields {
  schoolId: string;
  subject: string;
}

export default function AuthSection() {
  const [role, setRole] = useState<Role>("student");
  const session = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isStudent = role === "student";
  const isRegister = mode === "register";

  // Form state kept simple; split by role/mode
  const [studentRegister, setStudentRegister] = useState<StudentRegister>({
    schoolIdOrName: "",
    grade: "",
    name: "",
    studentId: "",
  });

  const [studentLogin, setStudentLogin] = useState<StudentLogin>({
    schoolIdOrName: "",
    grade: "",
    studentId: "",
  });

  const [teacherRegister, setTeacherRegister] = useState<TeacherRegister>({
    schoolId: "",
    grade: "",
    subject: "",
  });

  const [teacherLogin, setTeacherLogin] = useState<TeacherLogin>({
    schoolId: "",
    grade: "",
    subject: "",
  });

  const formTitle = useMemo(() => {
    const r = isStudent ? "Student" : "Teacher";
    const m = isRegister ? "Register" : "Login";
    return `${r} ${m}`;
  }, [isStudent, isRegister]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      // Build payload and validate
      const payload = isStudent
        ? isRegister
          ? studentRegister
          : studentLogin
        : isRegister
        ? teacherRegister
        : teacherLogin;

      const missing = Object.entries(payload).filter(([, v]) => !String(v || "").trim());
      if (missing.length > 0) {
        setMessage("Please fill all fields");
        setSubmitting(false);
        return;
      }

      // Register or login via OfflineManager
      let user: User | null = null;
      if (isStudent) {
        if (isRegister) {
          user = await OfflineManager.registerStudent({
            schoolIdOrName: studentRegister.schoolIdOrName,
            grade: studentRegister.grade,
            name: studentRegister.name,
            studentId: studentRegister.studentId,
          });
        } else {
          user = await OfflineManager.loginStudent({
            schoolIdOrName: studentLogin.schoolIdOrName,
            grade: studentLogin.grade,
            studentId: studentLogin.studentId,
          });
          if (!user) throw new Error("Student not found");
        }
      } else {
        if (isRegister) {
          user = await OfflineManager.registerTeacher({
            schoolId: teacherRegister.schoolId,
            grade: teacherRegister.grade,
            subject: teacherRegister.subject,
          });
        } else {
          user = await OfflineManager.loginTeacher({
            schoolId: teacherLogin.schoolId,
            grade: teacherLogin.grade,
            subject: teacherLogin.subject,
          });
          if (!user) throw new Error("Teacher not found");
        }
      }

      // Update session and navigate to profile
      session.setUser({
        userId: user.userId,
        role: user.role,
        name: user.name,
        grade: user.grade,
        schoolId: user.schoolId,
        schoolNameOrId: user.schoolNameOrId,
        studentId: user.studentId,
        subject: user.subject,
        preferredLanguage: user.preferredLanguage,
      });

      setMessage("Success! Redirecting to profile...");
      setTimeout(() => router.push("/profile"), 400);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mb-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">{formTitle}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isStudent
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
                onClick={() => setRole("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  !isStudent
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border"
                }`}
                onClick={() => setRole("teacher")}
              >
                Teacher
              </button>
            </div>
          </div>

          <div className="px-6 pt-4">
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg mb-6">
              <button
                type="button"
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  isRegister ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
              <button
                type="button"
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  !isRegister ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {isStudent ? (
                isRegister ? (
                  <>
                    <TextField
                      label="School Name / ID"
                      value={studentRegister.schoolIdOrName}
                      onChange={(v) =>
                        setStudentRegister((s) => ({ ...s, schoolIdOrName: v }))
                      }
                    />
                    <TextField
                      label="Class / Grade"
                      value={studentRegister.grade}
                      onChange={(v) => setStudentRegister((s) => ({ ...s, grade: v }))}
                    />
                    <TextField
                      label="Student Name"
                      value={studentRegister.name}
                      onChange={(v) => setStudentRegister((s) => ({ ...s, name: v }))}
                    />
                    <TextField
                      label="Student ID"
                      value={studentRegister.studentId}
                      onChange={(v) =>
                        setStudentRegister((s) => ({ ...s, studentId: v }))
                      }
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      label="School Name / ID"
                      value={studentLogin.schoolIdOrName}
                      onChange={(v) =>
                        setStudentLogin((s) => ({ ...s, schoolIdOrName: v }))
                      }
                    />
                    <TextField
                      label="Class / Grade"
                      value={studentLogin.grade}
                      onChange={(v) => setStudentLogin((s) => ({ ...s, grade: v }))}
                    />
                    <TextField
                      label="Student ID"
                      value={studentLogin.studentId}
                      onChange={(v) => setStudentLogin((s) => ({ ...s, studentId: v }))}
                    />
                  </>
                )
              ) : isRegister ? (
                <>
                  <TextField
                    label="School ID"
                    value={teacherRegister.schoolId}
                    onChange={(v) =>
                      setTeacherRegister((s) => ({ ...s, schoolId: v }))
                    }
                  />
                  <TextField
                    label="Class / Grade"
                    value={teacherRegister.grade}
                    onChange={(v) => setTeacherRegister((s) => ({ ...s, grade: v }))}
                  />
                  <TextField
                    label="Subject"
                    value={teacherRegister.subject}
                    onChange={(v) =>
                      setTeacherRegister((s) => ({ ...s, subject: v }))
                    }
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="School ID"
                    value={teacherLogin.schoolId}
                    onChange={(v) => setTeacherLogin((s) => ({ ...s, schoolId: v }))}
                  />
                  <TextField
                    label="Class / Grade"
                    value={teacherLogin.grade}
                    onChange={(v) => setTeacherLogin((s) => ({ ...s, grade: v }))}
                  />
                  <TextField
                    label="Subject"
                    value={teacherLogin.subject}
                    onChange={(v) => setTeacherLogin((s) => ({ ...s, subject: v }))}
                  />
                </>
              )}

              {message && (
                <div
                  className={`text-sm ${
                    message.includes("success") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg shadow"
                >
                  {submitting ? "Please wait..." : formTitle}
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 mt-4 pb-6">
              Note: This is a demo form. Data is not yet connected to storage or a
              backend. We will sync this with offline storage and background sync
              later.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        type="text"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

