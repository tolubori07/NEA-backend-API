const parseBody = async (req: Request) => {
  const contentType = req.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return await req.json(); // Parse JSON data

  } else if (contentType.includes("multipart/form-data") || 
             contentType.includes("application/x-www-form-urlencoded")) {

    const formData = await req.formData();
    const data: { [key: string]: any } = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    return data; // Return as an object

  } else if (contentType.includes("text/plain")) {
    return await req.text(); // Parse plain text

  } else {
    throw new Error("Unsupported Content-Type");
  }
}

export default parseBody
