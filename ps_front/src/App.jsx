import { useEffect, lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import api from "./api";
import Loading from "./Loading";
import RouteChangeHandler from "./RouteChangeHandler";

const Home = lazy(() => import("./Home"));
const Book = lazy(() => import("./Book"));
const Asset = lazy(() => import("./asset"));
const Dashboard = lazy(() => import("./dashboard"));
function dummy() {
  return;
}
const getResvs = async (callBack, monitorCallBack, alertCallBack) => {
  await api
    .get(`/getall`)
    .then((data) => {
      if (data.data.sts !== "ok") {
        alertCallBack("error", "network error");
      } else {
        callBack(data.data.all);
        monitorCallBack();
      }
    })
    .catch(() => {
      alertCallBack("error", "network error");
    });
};
const getObject = async (type, num, callBack, alertCallBack) => {
  await api
    .get(`/${type}/${num}`)
    .then((data) => {
      if (data.data.sts !== "ok") {
        alertCallBack("error", "network error");
      } else {
        callBack(data.data.object);
      }
    })
    .catch(() => {
      alertCallBack("error", "network error");
    });
};
const changeName = (e, callBack) => {
  callBack(e.target.value);
};
const onCheck = (e, tp, item, callBack) => {
  if (e.target.checked) {
    e.target.checked = true;
    callBack([...tp, item]);
  } else {
    e.target.checked = false;
    callBack(tp.filter((currItem) => currItem !== item));
  }
};
const changeDate = (e, callBack, clearCallBack) => {
  callBack(e.target.value);
  clearCallBack();
};
const cellColor = (object, period, date) => {
  if (object?.Reservations?.[date]?.yellow?.includes(period)) {
    return "yellow";
  } else if (object?.Reservations?.[date]?.red?.includes(period)) {
    return "red";
  } else {
    return "limegreen";
  }
};
const cellCheck = (object, period, date) => {
  if (object?.Reservations?.[date]?.yellow?.includes(period)) {
    return "none";
  } else if (object?.Reservations?.[date]?.red?.includes(period)) {
    return "none";
  } else {
    return "all";
  }
};
const changer = async (
  type,
  num,
  name,
  tp,
  date,
  color,
  callBack,
  getCallBack,
  monitor,
  monitorCallBack,
  clearCallBack,
  admin,
  alertCallBack
) => {
  await api
    .put(`/${type}/${color.slice(0, 1)}`, {
      num: num,
      name: name,
      tp: tp,
      date: date,
      color: color,
      admin: admin,
    })
    .then(async (data) => {
      if (data.data.sts == "ok") {
        await getCallBack(
          type,
          num,
          callBack,
          monitor,
          monitorCallBack,
          alertCallBack
        );
        clearCallBack();
        alertCallBack("success", "Your Reservation Was Saved");
      } else {
        if (data.data.err == "tp") {
          await getCallBack(
            type,
            num,
            callBack,
            monitor,
            monitorCallBack,
            alertCallBack
          );
          clearCallBack();
          alertCallBack(
            "error",
            "We are sorry, the time periods were just reserved By another User, please try again"
          );
        } else {
          alertCallBack("error", data.data.err);
        }
      }
    })
    .catch((err) => alertCallBack("error", err.message));
};

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (navigator.userAgent.match(/samsung/i)) {
      alert(
        "Your browser (Samsung Internet) may not show this website's colors correctly in Dark Mode with setting: 'use dark mode: always/when phone dark mode is on' or when option: 'dark theme sites' is checked. Please choose 'light theme websites' or consider using a standards-compliant browser instead. \n\n" +
          "We recommend Firefox, Microsoft Edge, or Google Chrome."
      );
    }
    window.scrollTo(0, 0);
  }, []);
  const notify = (e, msg) => {
    toast[e](msg, {
      position: "top-right",
      autoClose: 2200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  };
  return (
    <Router>
      <ToastContainer />
      <RouteChangeHandler setLoading={setLoading} />
      {loading ? (
        <Loading />
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/book"
              element={
                <Book notify={notify} getResvs={getResvs} dummy={dummy} />
              }
            />
            <Route
              path="/dbrd"
              element={
                <Dashboard
                  notify={notify}
                  changeName={changeName}
                  onCheck={onCheck}
                  changeDate={changeDate}
                  cellColor={cellColor}
                  cellCheck={cellCheck}
                  changer={changer}
                  getResvs={getResvs}
                />
              }
            />
            <Route
              path="/book/:type/:no"
              element={
                <Asset
                  notify={notify}
                  changeName={changeName}
                  onCheck={onCheck}
                  changeDate={changeDate}
                  cellColor={cellColor}
                  cellCheck={cellCheck}
                  changer={changer}
                  getObject={getObject}
                  dummy={dummy}
                />
              }
            />
          </Routes>
        </Suspense>
      )}
    </Router>
  );
}
export default App;
