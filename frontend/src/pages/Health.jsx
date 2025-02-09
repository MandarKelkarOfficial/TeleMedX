import AuthButton from "./AuthButton";
import HeartRate from "./HeartRate";
import StepsCount from "./StepsCount";

export default function Health() {
  return (
    <div style={{ padding: "20px" }}>
      <AuthButton />
      <br />
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
        <StepsCount />
        <HeartRate />
      </div>
    </div>
  );
}
