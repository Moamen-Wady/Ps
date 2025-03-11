import { useState, useEffect, memo, useCallback } from "react";
const timePeriods = [
  "12:00",
  "12:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
];

export default memo(function Asset({
  notify,
  changeName,
  onCheck,
  changeDate,
  cellColor,
  cellCheck,
  changer,
  getObject,
  dummy,
}) {
  //API CALLS
  const [object, setObject] = useState({
    Reservations: {},
    num: 0,
  });
  const [tp, setTp] = useState([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(true);
  let href = window.location.href;
  let sliced = href.split("/book/");
  let infoarr = sliced[1].split("/");
  let type = infoarr[0];
  let num = infoarr[1];

  useEffect(() => {
    if (tp.length == 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [tp.length]);

  useEffect(() => {
    getObject(type, num, setObject, notify);
  }, [getObject, type, num]);

  const clear = useCallback(() => {
    setTp([]);
    setName("");
    document.querySelectorAll("input.tpchb").forEach((i) => {
      i.checked = false;
    });
    document.querySelectorAll("input#nameInput").forEach((i) => {
      i.value = "";
    });
  }, []);

  const nameCheck = useCallback(async () => {
    if (date == "" || name == "" || tp.length == 0) {
      notify("please choose date, times and enter your name");
      return;
    }
    //the next filter is for malfunctions or possible walkarounds around the code
    let tpff = tp.filter((i) => {
      return (
        object?.Reservations?.[date]?.yellow?.includes(i) ||
        object?.Reservations?.[date]?.red?.includes(i)
      );
    });
    if (tpff.length > 0) {
      await getObject(type, num, setObject, notify);
      notify(
        "Chosen time periods are reserved, please rebook your desired times"
      );
      clear();
    } else {
      changer(
        type,
        num,
        name,
        tp,
        date,
        "yellow",
        setObject,
        getObject,
        0,
        dummy,
        clear,
        0,
        notify
      );
    }
  }, []);
  return (
    <>
      <div className="hicont">
        <img src="/logoiw.png" alt="" className="headerimg" />
      </div>
      <h1 className="h1">Unlock Your Potential </h1>
      <div className="options">
        <h3 className="h3form">
          Now Choose Your Desired Date & Time Then submit, You will then be
          redirected to payment page
        </h3>
        <input
          type="date"
          className="date1"
          name="date"
          id="date"
          onChange={(e) => changeDate(e, setDate, clear)}
          placeholder="Choose Date"
        />
        <form id="times">
          <div className="timePeriods">
            {timePeriods?.map((period) => {
              return (
                <label
                  className="container"
                  key={period}
                  style={{
                    pointerEvents: cellCheck(object, period, date),
                    backgroundColor: "whitesmoke",
                  }}
                >
                  {" " + period + " "}
                  <input
                    type="checkbox"
                    className="tpchb"
                    disabled={date == "" ? true : false}
                    onChange={(e) => onCheck(e, tp, period, setTp)}
                    style={{
                      pointerEvents: cellCheck(object, period, date),
                      backgroundColor: cellColor(object, period, date),
                    }}
                  />
                  <span
                    className="checkmark"
                    style={{
                      pointerEvents: cellCheck(object, period, date),
                      backgroundColor: cellColor(object, period, date),
                    }}
                  ></span>
                </label>
              );
            })}
          </div>
        </form>
        <input
          type="text"
          className="nameInput"
          id="nameInput"
          placeholder="Name In English"
          onChange={(e) => changeName(e, setName)}
          disabled={disabled}
        />
        <button onClick={nameCheck} className="submit" disabled={disabled}>
          Submit
        </button>
      </div>
    </>
  );
});
