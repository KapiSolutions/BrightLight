export default async function revalidate(req, res) {
  if (req.method === "POST") {
    const { secret, paths } = req.body;

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.NEXT_PUBLIC_API_KEY) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      // path should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"
      await Promise.all(
        paths.map(async (path) => {
          await res.revalidate(path);
          console.log(path);
          await res.revalidate("/pl" + path);
          await res.revalidate("/en" + path);
        })
      );

      return res.status(200).json({ revalidated: true });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error revalidating");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
