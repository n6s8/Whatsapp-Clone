import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Logo from "../assets/logo.png";
import GitHub from "../assets/git.png";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const navigate = useNavigate();

  const enter = () => {
    if (!phoneNumber || !idInstance || !apiTokenInstance) {
      alert("Please ensure that you enter all of the inputs!");
      return;
    }

    localStorage.setItem("phoneNumber", phoneNumber);
    localStorage.setItem("idInstance", idInstance);
    localStorage.setItem("apiTokenInstance", apiTokenInstance);

    navigate("/chat");
  };
  const open_git = () => {
    window.open("https://github.com/n6s8");
  };

  return (
    <div className={styles.global}>
      <img src={Logo} alt="logo" className={styles.logo} />
      <img
        src={GitHub}
        alt="GitHub"
        className={styles.git}
        onClick={open_git}
      />
      <div className={styles.main}>
        <h2>Enter WhatsApp Credentials</h2>
        <input
          type="text"
          placeholder="WhatsApp Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Instance ID"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="API Token"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          className={styles.input}
        />
        <button onClick={enter} className={styles.btn}>
          Login
        </button>
      </div>
    </div>
  );
}
