const VerifiedDoctors = ({ doctors }) => {
  return (
    <div>
      {doctors.map((dr) => {
        return (
          <div key={dr.id}>
            <h2>{dr.name}</h2>
            <p>{dr.specialization}</p>
            <p>{dr.experience} years of experience</p>
          </div>
        );
      })}
    </div>
  );
};

export default VerifiedDoctors;
