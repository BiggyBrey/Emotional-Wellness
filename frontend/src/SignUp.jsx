import { createUser, checkUsername } from "./services/api"
import { useUserAuth } from "./services/UserAuth.jsx";
import { useState } from "react";
import {
  useActionData,
  Form,
  Link,
  useLoaderData,
  redirect,
  useNavigate
} from "react-router-dom";
import ErrorMessage from "./components/ErrorMessage"


// export async function action({ request }) {
//   const formData = await request.formData()
//   const username = formData.get("username")
//   const password = formData.get("password")
//   const confirmPassword = formData.get("confirm-password")
//   console.log(username, password, confirmPassword)
//   try {
//     // the user enters in username passowrd and confirm pass
//     //check if username is available
//     // if available proceed otherwise stop
//     // check if confirm password = password
//     // create a suer with username and passwsord
//     //on successful sign in
//     const response = await checkUsername(username)
//     console.log(response.data)
//     //check if username available
//     if (!response.data.available) {
//       console.log("username not available")
//       return "username not available"
//     }
//     //check if passwors match
//     if (password !== confirmPassword) {
//       console.log('Passwords do not match!');
//       return "Passwords do not match"
//     }
//     // create user
//     const user = await createUser({ username, password })
//     console.log("user created")
//     console.log(user.data)
//     // const response = await loginUser({ username, password })
//     // console.log(response.data.userId)
//     const userID = user.data.user._id;
//     console.log(userID)
//     localStorage.setItem("userID", JSON.stringify(userID))

//     return redirect("/dashboard")

//   }
//   catch (error) {
//     //on incorrect signin
//     return error.response?.data.message || null
//   }

// }

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  // const errorMessage = useActionData()
  const navigate = useNavigate()
  // console.log(errorMessage)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await checkUsername(username)
    console.log(response.data)
    //check if username available
    if (!response.data.available) {
      console.log("username not available")
      setIsError(true)
      setErrorMessage("username not available")
      return
    }
    //check if passwors match
    if (password !== confirmPassword) {
      console.log('Passwords do not match!');
      setIsError(true)
      setErrorMessage("Passwords do not match")
      return
    }
    // create user
    const user = await createUser({ username, password })
    console.log("user created")
    console.log(user.data)
    // const response = await loginUser({ username, password })
    // console.log(response.data.userId)
    const userID = user.data.user._id;
    console.log(userID)
    localStorage.setItem("userID", JSON.stringify(userID))
    navigate("/dashboard")
    // if (password !== confirmPassword) {
    //   setErrorMessage('Passwords do not match!');
    // } else {
    //   setErrorMessage('');
    //   // Proceed with form submission logic here
    //   console.log('Form submitted successfully with password:', password);
    // }
  };

  return (
    <div className="relative flex justify-center  isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto flex max-w-7xl px-6 lg:px-8">
        <div className="max-w-xl lg:max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Register for MindCare
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            Free your mind with MindCare
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex  max-w gap-x-4 flex-col">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Enter your Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />

            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your Password"
              autoComplete="new-password"
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              placeholder="Confirm your Password"
              autoComplete="new-password"
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="flex-none mt-4 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign up Now
            </button>
          </form>
        </div>


      </div>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
    </div>
  );
}