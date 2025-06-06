import { useNavigate } from 'react-router-dom'

const infoCards = [
  {
    title: 'Organize Your Work',
    description:
      'Create multiple boards to separate different projects or teams, keeping your tasks well organized.',
    icon: (
      <svg
        className="w-10 h-10 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13v6M2 12h4v8H2v-8z" />
      </svg>
    ),
  },
  {
    title: 'Visualize Your Tasks',
    description:
      'Use columns like "To Do", "In Progress", and "Done" to easily track task progress visually.',
    icon: (
      <svg
        className="w-10 h-10 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7h18M3 12h18M3 17h18"
        />
      </svg>
    ),
  },
  {
    title: 'Collaborate Efficiently',
    description:
      'Assign tasks to team members, set priorities, and manage deadlines to boost productivity.',
    icon: (
      <svg
        className="w-10 h-10 text-purple-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 12a4 4 0 10-8 0 4 4 0 008 0z"
        />
      </svg>
    ),
  },
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 bg-gray-50">
      <h1 className="text-5xl font-extrabold mb-6 text-gray-800">Welcome to TaskBoard</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-3xl text-center">
        A powerful and intuitive task management tool designed to help you and your team stay
        organized, collaborate efficiently, and get work done.
      </p>

      {/* Cards container */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 max-w-6xl w-full mb-12">
        {infoCards.map(({ title, description, icon }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate('/board')}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium"
      >
        Get Started
      </button>
    </div>
  )
}

export default Home
