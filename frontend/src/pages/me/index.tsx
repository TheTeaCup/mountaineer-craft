import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Heading } from "@chakra-ui/react";
import Loading from "@/components/loading";

type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
};

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      router.push("/login");
      return;
    }

    fetch("https://api.mountaineercraft.net/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data: { id: string; username: string; email: string; avatar?: string }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        router.push("/login");
      });
  }, [router]);

  if (loading) return <Loading />;

  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box p={4}>
      <Heading mb={4}>Your Profile</Heading>
      <p><strong>ID:</strong> {user?.id}</p>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      {user?.avatar && <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" />}
    </Box>
  );
}
