import Appbar from "../components/Appbar"
import Balance from "../components/Balance"
import Users from "../components/Users"
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!userToken) {
      navigate("/signin");
    } else {
        axios.get(`/api/v1/account/balance?userId=${userId}`, { 
            headers: { Authorization: "Bearer " + userToken }
          })
          
        .then((response) => {
            console.log(response.data.balance);
          setBalance(response.data.balance);
        })
        .catch((error) => {
          navigate("/signin");
        });
    }
  }, [navigate]);
    
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={"10,000"} />
            <Users />
        </div>
    </div>
}