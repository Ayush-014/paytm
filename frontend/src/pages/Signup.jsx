import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token)
      navigate("/dashboard");
  },[])

    return <div className="bg-slate-600 h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Signup"} />
                <SubHeading label={"Enter your information to create an account"} />
                <InputBox onChange={(e) => {
                  setFirstName(e.target.value);
                }} placeholder={"sanjay"} label={"First Name"} />
                <InputBox onChange={(e) => {
                  setLastName(e.target.value);
                }} placeholder={"mishra"} label={"Last Name"} />
                <InputBox onChange={(e) => {
                  setUserName(e.target.value);
                }} placeholder={"sanjay@123"} label={"User Name"} />
                <InputBox onChange={(e) => {
                  setPassword(e.target.value);
                }} placeholder={"********"} label={"Password"} />

                <div className="pt-4">
                    <Button onClick={ async () => {
                      const response = await axios.post("http://localhost:3000/api/v1/users/signup", {
                        userName,
                        firstName,
                        lastName,
                        password
                      });
                      console.log("response.data.userId " + response.data.userId);
                      console.log("response.data.token " + response.data.token);
                      localStorage.setItem("token", response.data.token);
                      localStorage.setItem("userId", response.data.userId);

                      navigate("/dashboard");
                    }} label={"Signup"} />
                </div>
                <BottomWarning label={"Already have an account?"} bottomText={"Signin"} />
            </div>
        </div>
    </div>
}