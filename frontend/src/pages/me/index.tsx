import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Heading } from "@chakra-ui/react";
import Loading from "@/components/loading";

type User = {
  name: string;
  email: string;
};

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.mountaineercraft.net/me", {
      credentials: "include", // if using cookies/session
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data: User) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        // Redirect to login if unauthenticated
      //  router.push("/login");
      });
  }, [router]);

  if (loading) return <Loading />;

  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box>
      <Heading>Your Profile</Heading>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
    </Box>
  );
}
