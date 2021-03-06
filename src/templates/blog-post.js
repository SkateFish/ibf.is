import React from "react";
import { graphql } from "gatsby";
import Layout from "src/ui/components/Layout";
import Menu from "src/ui/components/Menu";
import Section from "src/ui/components/Section";
import BlogContent from "src/ui/components/BlogContent";
import { H3 } from "src/ui/components/Typography";
import TranslationContext from "src/utility/TranslationContext";
import { withLang } from "src/utility/Translation";
import Helmet from "react-helmet";

export const query = graphql`
  query BlogPostQuery($lang: String!, $uid: String!) {
    posts: allPrismicPost(
      filter: {
        lang: { eq: $lang }
        uid: { eq: $uid }
        data: { on_blog: { eq: "yes" } }
      }
    ) {
      edges {
        node {
          uid
          data {
            image {
              url
            }
            on_blog
            date: publish_date(formatString: "DD/MM/YY HH:mm")
            summary {
              text
            }
            text {
              html
            }
            title {
              text
            }
            author {
              document {
                ... on PrismicMember {
                  id
                  data {
                    name {
                      text
                    }
                    title {
                      text
                    }
                    profile {
                      url
                    }
                  }
                }
              }
            }
            body {
              ... on PrismicPostBodyPodcastSlice {
                id
                primary {
                  podcast {
                    id
                    document {
                      ... on PrismicPodcast {
                        id
                        data {
                          description {
                            text
                          }
                          image {
                            url
                          }
                          embed {
                            html
                          }
                        }
                      }
                    }
                  }
                }
              }
              ... on PrismicPostBodyEventSlice {
                id
                primary {
                  event {
                    document {
                      ... on PrismicEvent {
                        id
                        data {
                          address
                          title {
                            text
                          }
                        }
                      }
                    }
                  }
                }
              }
              ... on PrismicPostBodyExternalLink {
                id
                primary {
                  link {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const BlogPost = ({ data, pageContext }) => {
  const { uid, lang } = pageContext;

  const T = withLang(lang);

  let posts = pageContext.posts;
  const post = data.posts.edges[0];

  if (!post) throw Error("Post not found");

  const title = post.node.data.title.text;
  const date = post.node.data.date;
  const text = post.node.data.text.html;
  const summary = post.node.data.summary.text;
  let author = null;

  if (post.node.data.author.document) {
    author = {
      name: post.node.data.author.document.data.name.text,
      title: post.node.data.author.document.data.title.text,
      profile: post.node.data.author.document.data.profile.url,
    };
  }

  const body = post.node.data.body[0];

  let image = post.node.data.image ? post.node.data.image.url : null;
  let next = null;
  let previous = null;

  posts = posts.filter(p => p.on_blog === "yes");

  posts.forEach((post, index) => {
    if (post.uid !== uid) return true;

    if (posts[index + 1]) next = posts[index + 1];
    if (posts[index - 1]) previous = posts[index - 1];

    return false;
  });

  const slices = [];

  if (body) {
    if (body.primary.podcast && body.primary.podcast.document) {
      const podcastText = body.primary.podcast.document.data.text
        ? body.primary.podcast.document.data.text.text
        : null;

      const podcastImage = body.primary.podcast.document.data.image
        ? body.primary.podcast.document.data.image.url
        : null;

      if (!image) {
        image = `${podcastImage}&fit=crop&h=261&w=500&crop=top`;
      }

      slices.push({
        type: "podcast",
        data: {
          text: podcastText,
          image: podcastImage,
        },
        component: (
          <div key={`podcast-${podcastText}`}>
            <H3>{T("listenToEpisodeHeading")}</H3>
            <div
              dangerouslySetInnerHTML={{
                __html: body.primary.podcast.document.data.embed.html,
              }}
              style={{
                marginTop: "8px",
                marginBottom: "32px",
              }}
            />
          </div>
        ),
      });
    }
  }

  const pageTitle = `${title} - ${T("foundationName")}`;
  const pageDescription = summary;
  return (
    <TranslationContext.Provider value={lang}>
      <Layout>
        <Helmet>
          <title>{pageTitle}</title>
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta name="description" content={pageDescription} />
          {image && <meta name="twitter:image:alt" content={pageTitle} />}
          {image && <meta property="og:image" content={image} />}
          {image && <meta name="image" content={image} />}
          <meta
            property="og:url"
            content={`https://ibf.is/${lang}/blog/${uid}`}
          />
          <meta property="og:type" content="article" />
        </Helmet>
        <Menu />
        <Section
          top="xsmall"
          bottom="xlarge"
          backgroundText={T("blog")}
          legendTextColor="dark"
        >
          <BlogContent
            title={title}
            date={date}
            content={text}
            slices={slices}
            previous={previous}
            next={next}
            image={image}
            author={author}
          />
        </Section>
      </Layout>
    </TranslationContext.Provider>
  );
};
export default BlogPost;
