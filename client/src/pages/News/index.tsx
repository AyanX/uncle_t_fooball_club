import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import BlurImage from "@/components/common/BlurImage/BlurImage";
import Loader from "@/components/common/Loader/Loader";
import { useAppContext } from "@/context/AppContext";
import { Helmets } from "@/helmet";
import styles from "./News.module.scss";

const News: React.FC = () => {
  const { news, newsCategories, loading, trackClick } = useAppContext();
  const [category, setCategory] = useState<string>("All");

  const sorted = news ? [...news]?.sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
  ) : [];
  const filtered =
    category === "All" ? sorted : sorted?.filter((n) => n.category === category);
    const allCats =newsCategories ? ["All", ...newsCategories?.map((c) => c.category)] : ["All"];

  return (
    <main>
      {Helmets.news}
      <PageHeader
        eyebrow="Latest"
        title="News & Updates"
        subtitle="Stay up to date with all the latest from Uncle T FC."
        image="https://ik.imagekit.io/59p9lo9mv/soccer/steptodown.com195808.jpg"
      />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.filters}>
            {allCats?.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${category === cat ? styles.active : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading.news || !news || !newsCategories ? (
            <Loader />
          ) : (
            <motion.div layout className={styles.grid}>
              {filtered.map((item, i) => (
                <motion.article
                  key={item.id}
                  layout
                  className={`${styles.card} ${item.featured && i === 0 ? styles.featured : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/news/${item.slug}`}
                    onClick={() => trackClick(item.id)}
                    className={styles.cardLink}
                  >
                    <div className={styles.imgWrap}>
                      <BlurImage
                        src={item.image}
                        blur_image={item.blur_image}
                        alt={item.title}
                      />
                      <span className={styles.category}>{item.category}</span>
                    </div>
                    <div className={styles.body}>
                      <div className={styles.meta}>
                        <span className={styles.metaItem}>
                          <Clock size={12} /> {item.readTime} min read
                        </span>
                        <span className={styles.metaItem}>
                          {new Date(item.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className={styles.title}>{item.title}</h2>
                      <p className={styles.excerpt}>{item.excerpt}</p>
                      <span className={styles.readMore}>
                        Read More <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default News;
