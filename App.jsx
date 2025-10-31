import React, { useState, useEffect, useRef } from "react";

// ================= MAIN APP =================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [route, setRoute] = useState("home"); // 'home' | 'course' | 'dashboard'
  const [selectedCourse, setSelectedCourse] = useState(null);

  const sampleCourses = [
    {
      id: "c1",
      title: "HTML & CSS — From Zero to Designer",
      author: "Asha Rao",
      duration: "4h 12m",
      thumbnail: "https://picsum.photos/seed/html/400/250",
      video: "https://www.youtube.com/embed/pQN-pnXPaVg",
      description:
        "Learn the foundations of web layout, responsive design, and modern CSS techniques through projects and exercises.",
    },
    {
      id: "c2",
      title: "JavaScript Essentials: The Joy of Code",
      author: "Ravi Menon",
      duration: "6h 05m",
      thumbnail: "https://picsum.photos/seed/js/400/250",
      video: "https://www.youtube.com/embed/hdI2bqOjy3c",
      description:
        "Understand core JavaScript, DOM manipulation, and start building interactive web apps.",
    },
    {
      id: "c3",
      title: "Data Structures for Interviews: Great Learning",
      author: "Priya Sharma",
      duration: "3h 20m",
      thumbnail: "https://picsum.photos/seed/ds/400/250",
      video: "https://www.youtube.com/embed/bum_19loj9A",
      description:
        "A compact guide to arrays, linked lists, stacks, queues, trees and hashing — focused on interview-ready patterns.",
    },
  ];

  const [progress, setProgress] = useState(() => {
    const raw = localStorage.getItem("elearn_progress_v1");
    return raw ? JSON.parse(raw) : {};
  });

  useEffect(() => {
    localStorage.setItem("elearn_progress_v1", JSON.stringify(progress));
  }, [progress]);

  function openCourse(course) {
    setSelectedCourse(course);
    setRoute("course");
  }

  function updateProgress(courseId, value) {
    setProgress((p) => ({
      ...p,
      [courseId]: Math.max(0, Math.min(100, value)),
    }));
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopNav route={route} setRoute={setRoute} onLogout={() => setIsLoggedIn(false)} />

      <main className="container mx-auto p-6">
        {route === "home" && (
          <Home
            courses={sampleCourses}
            openCourse={openCourse}
            progress={progress}
            setRoute={setRoute}
          />
        )}

        {route === "course" && selectedCourse && (
          <CourseDetail
            course={selectedCourse}
            progress={progress[selectedCourse.id] || 0}
            updateProgress={(val) => updateProgress(selectedCourse.id, val)}
            back={() => setRoute("home")}
          />
        )}

        {route === "dashboard" && (
          <Dashboard
            courses={sampleCourses}
            progress={progress}
            setRoute={setRoute}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

// ================= LOGIN / SIGNUP PAGE =================
function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-indigo-700">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-sm text-center text-gray-500">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-indigo-600 hover:underline"
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}

// ================= NAVBAR =================
function TopNav({ route, setRoute, onLogout }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
            E
          </div>
          <div>
            <div className="font-semibold">E-Learn</div>
            <div className="text-xs text-gray-500">
              Courses · Progress · Videos
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => setRoute("home")}
            className={`px-3 py-1 rounded-md ${
              route === "home"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setRoute("dashboard")}
            className={`px-3 py-1 rounded-md ${
              route === "dashboard"
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>

          <div className="border-l h-6" />
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded-md text-sm bg-white shadow-sm"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

// ================= HOME PAGE =================
function Home({ courses, openCourse, progress, setRoute }) {
  const [query, setQuery] = useState("");
  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Learn something new today</h1>
          <p className="text-gray-500 mt-1">
            Curated courses, tiny wins, big changes.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="px-3 py-2 rounded-md border w-64"
          />
          <button
            onClick={() => setRoute("dashboard")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            My Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            openCourse={openCourse}
            progress={progress[course.id] || 0}
          />
        ))}
      </div>
    </section>
  );
}

// ================= COURSE CARD =================
function CourseCard({ course, openCourse, progress }) {
  return (
    <article className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="rounded-lg w-full h-44 object-cover mb-3"
      />
      <h3 className="font-semibold text-lg">{course.title}</h3>
      <p className="text-sm text-gray-500">
        By {course.author} · {course.duration}
      </p>
      <div className="mt-3">
        <ProgressBar percent={progress} />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => openCourse(course)}
          className="flex-1 px-3 py-2 rounded-md bg-indigo-600 text-white"
        >
          Open
        </button>
        <button className="px-3 py-2 rounded-md border">Save</button>
      </div>
    </article>
  );
}

function ProgressBar({ percent }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Progress</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg,#7c3aed,#ec4899)",
          }}
        />
      </div>
    </div>
  );
}

// ================= COURSE DETAIL =================
function CourseDetail({ course, progress, updateProgress, back }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = videoRef.current;
      if (!iframe) return;
      // Simulate a slight increase to imitate watch progress
      updateProgress(progress + 0.1);
    }, 1000);
    return () => clearInterval(interval);
  }, [progress, updateProgress]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
        <button onClick={back} className="text-sm text-gray-500 mb-3">
          ← Back
        </button>
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <p className="text-sm text-gray-500">
          By {course.author} · {course.duration}
        </p>

        <div className="mt-4 rounded-lg overflow-hidden shadow aspect-video">
          <iframe
            ref={videoRef}
            src={course.video}
            title={course.title}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold">About this course</h3>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={progress} />
          </div>
        </div>
      </div>

      <aside className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
        <h4 className="font-semibold">Course Outline</h4>
        <ol className="list-decimal list-inside text-sm text-gray-600">
          <li>Intro & Setup</li>
          <li>Core Concepts</li>
          <li>Hands-on Project</li>
          <li>Advanced Patterns</li>
          <li>Revision & Quiz</li>
        </ol>

        <div className="mt-auto">
          <button
            onClick={back}
            className="w-full px-4 py-2 rounded-md bg-green-600 text-white"
          >
            Mark as completed
          </button>
        </div>
      </aside>
    </div>
  );
}

// ================= DASHBOARD + FOOTER =================
function Dashboard({ courses, progress, setRoute }) {
  const completed = courses.filter((c) => (progress[c.id] || 0) >= 100).length;
  const total = courses.length;
  const overall = Math.round(
    courses.reduce((s, c) => s + (progress[c.id] || 0), 0) / (total || 1)
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Your learning snapshot</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Courses completed</div>
          <div className="text-xl font-semibold">
            {completed}/{total}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="font-semibold mb-3">Overall progress</h4>
          <div className="text-3xl font-bold">{overall}%</div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h4 className="font-semibold mb-3">Your courses</h4>
          <div className="space-y-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.thumbnail}
                    alt="t"
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-gray-500">{c.author}</div>
                  </div>
                </div>
                <div className="w-64">
                  <ProgressBar percent={progress[c.id] || 0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => setRoute("home")}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white"
        >
          Back to browse
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 py-6 text-center text-sm text-gray-500">
      Made by Chandana V — E-Learning Platform UI
    </footer>
  );
}
