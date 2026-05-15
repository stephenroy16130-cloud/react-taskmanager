function UserCard({ name, role, avatarUrl }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm mx-auto">
      <img
        src={avatarUrl}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="text-xl font-semibold text-center mt-4">{name}</h2>
      <p className="text-gray-500 text-center">{role}</p>
      <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
        View Profile
      </button>
    </div>
  );
}

export default UserCard;