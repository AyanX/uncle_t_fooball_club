const validTitle = (title) => {
    if(!title.title) return false;
    return true;
}

const validTitlesToClient = titles =>{
    return titles.map(title => {
        return {
            id: title.id,
            title: title.title
        }
    })
}
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
    return program.slug && program.title &&
     program.tagline && program.description && program.longDescription
       && program.stats.length > 0
      && program.highlights.length > 0;
}

const  programsToClient = (programs) => {
    return programs.map(program => {
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
            stats: typeof program.stats === "string"
  ? JSON.parse(program.stats)
  : program.stats,
            highlights: typeof program.highlights === "string"
  ? JSON.parse(program.highlights)
  : program.highlights
        }
    })
}

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
        stats: JSON.stringify(program.stats),
        highlights: JSON.stringify(program.highlights)
    }
}



module.exports = {
    validTitle,
    programToDb,
    validTitlesToClient,
    programsToClient,
    validProgram
}