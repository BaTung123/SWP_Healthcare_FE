const getBloodColor = (type) => {
  switch (type) {
    case 'A+': return '#e53935';
    case 'A-': return '#d81b60';
    case 'B+': return '#8e24aa';
    case 'B-': return '#3949ab';
    case 'AB+': return '#00897b';
    case 'AB-': return '#43a047';
    case 'O+': return '#f4511e';
    case 'O-': return '#6d4c41';
    default: return '#9e9e9e';
  }
}

const BloodDropBadge = ({ type }) => {

  const color = getBloodColor(type);

  return (
    <div className="w-12 h-12 relative">
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32 2C32 2 6 30 6 44C6 54.4934 14.5066 63 25 63H39C49.4934 63 58 54.4934 58 44C58 30 32 2 32 2Z"
          fill={color}
        />
      </svg>
      <div className="absolute inset-0 top-3.5 flex items-center justify-center">
        <span className="text-white font-bold text-lg">{type}</span>
      </div>
    </div>
  )
}

export default BloodDropBadge
