export default function Loading() {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "auto",
      backgroundColor: "transparent",
      padding: "0 ",
      flexDirection: "column",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    },
    text: {
      fontSize: "5vw",
      color: "black",
      fontFamily: " 'Raleway', sans-serif",
      padding: "0",
      margin: "0",
    },
    img: {
      width: "12vw",
      height: "12vw",
      display: "block",
      margin: "auto",
    },
  };
  return (
    <div style={styles.container}>
      <img src="loading.gif" alt="Loading" style={styles.img} />
      {/* <h1 style={styles.text}>Loading...</h1> */}
    </div>
  );
}
