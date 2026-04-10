const validTitle = (title) => {
  if (!title.title) return false;
  return true;
};

const validTitlesToClient = (titles) => {
  return titles.map((title) => {
    return {
      id: title?.id,
      title: title.title,
    };
  });
};
// export interface Program {
//   id: number;
//   slug: string;
//   title: string;
//   tagline: string;
//   description: string;
//   longDescription: string;
//   image: string;
//   blur_image: string;
//   icon: string;
//   color: string;
//   stats: { label: string; value: string }[];
//   highlights: string[];
// }

const validProgram = (program) => {
  return (
    program.slug &&
    program.title &&
    program.tagline &&
    program.description &&
    program.longDescription &&
    program.stats.length > 0 &&
    program.highlights.length > 0
  );
};

const programsToClient = (programs) => {
  return programs.map((program) => {
    return {
      id: program.id,
      slug: program.slug,
      title: program.title,
      tagline: program.tagline,
      description: program.description,
      longDescription: program.longDescription,
      image: program.image,
      blur_image: program.blur_image,
      icon: program.icon,
      color: program.color,
      stats:JSON.parse(program.stats),
      highlights:JSON.parse(program.highlights)
    };
  });
};

const safeParse = (data) => {
  try {
    if (typeof data !== "string") return data;
    if (data.includes("[object Object]")) return []; 
    return JSON.parse(data);
  } catch (err) {
    console.warn("JSON parse failed:", data);
    return Array.isArray(data) ? data : [];
  }
};

const singleProgramToClient = (program,xId) => {
  return {
    id: program.id || +xId,
    slug: program.slug,
    title: program.title,
    tagline: program.tagline,
    description: program.description,
    longDescription: program.longDescription,
    image: program.image,
    blur_image: program.blur_image,
    icon: program.icon,
    color: program.color,
    stats: safeParse(program.stats),
    highlights: safeParse(program.highlights)
  };
};

const safeStringify = (data, fallback = "[]") => {
  try {
    // null / undefined
    if (data == null) return fallback;

    // already string
    if (typeof data === "string") {
      // check if it's valid JSON
      JSON.parse(data); // will throw if invalid
      return data; // ✅ already stringified properly
    }

    // object / array
    return JSON.stringify(data);
  } catch (err) {
    console.warn("Stringify failed, using fallback:", data);
    return fallback;
  }
};


const programToDb = (program) => {
  return {
    slug: program.slug,
    title: program.title,
    tagline: program.tagline,
    description: program.description,
    longDescription: program.longDescription,
    image: program.image,
    blur_image: program.blur_image,
    icon: program.icon,
    color: program.color,

    stats:safeStringify(program.stats),

    highlights: safeStringify(program.highlights)
  };
};

module.exports = {
  validTitle,
  programToDb,
  validTitlesToClient,
  programsToClient,
  validProgram,
  singleProgramToClient
};
