"use client";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Heart,
  User,
  Camera,
  X,
  Menu,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Destination = {
  id: number;
  name: string;
  description: string;
  image: string;
  country: string;
};
type Experience = {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  rating: number;
  totalRatings: number;
};
type Comment = {
  id: number;
  user: string;
  text: string;
  date: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
  experienceId: number;
};
type Reply = {
  id: number;
  user: string;
  text: string;
  date: string;
};

type GalleryImage = {
  url: string;
  postedBy: string;
  location: string;
  date: string;
  size: "wide" | "tall" | "square";
  description: string;
};

export default function TravelBlog() {
  const [darkMode, setDarkMode] = useState(false);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState({
    destinations: false,
    experiences: false,
    gallery: false,
  });
  const loadCommentsFromStorage = (): Comment[] => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("travel-blog-comments");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      {
        id: 1,
        user: "Alex",
        text: "This sunset sailing experience was absolutely magical!",
        date: "2024-06-15",
        likes: 12,
        liked: false,
        replies: [
          {
            id: 101,
            user: "Sarah",
            text: "I totally agree! The views were incredible.",
            date: "2024-06-16",
          },
        ],
        experienceId: 1,
      },
      {
        id: 2,
        user: "Emma",
        text: "The tea ceremony was so peaceful and enlightening.",
        date: "2024-03-25",
        likes: 8,
        liked: false,
        replies: [],
        experienceId: 2,
      },
      {
        id: 3,
        user: "Michael",
        text: "Best tapas tour ever! The food was incredible.",
        date: "2024-05-08",
        likes: 15,
        liked: false,
        replies: [
          {
            id: 102,
            user: "Carlos",
            text: "Which places did you visit? Planning to go soon!",
            date: "2024-05-09",
          },
          {
            id: 103,
            user: "Michael",
            text: "Started at Bar Central, then Cal Pep - both amazing!",
            date: "2024-05-10",
          },
        ],
        experienceId: 3,
      },
      {
        id: 4,
        user: "Sophie",
        text: "The Seine cruise at night was breathtaking! Highly recommend the evening tour.",
        date: "2024-04-20",
        likes: 9,
        liked: false,
        replies: [],
        experienceId: 4,
      },
      {
        id: 5,
        user: "David",
        text: "Inca Trail was challenging but worth every step. Make sure to book months in advance!",
        date: "2024-08-18",
        likes: 18,
        liked: false,
        replies: [
          {
            id: 104,
            user: "Maria",
            text: "How was the altitude? I'm worried about that.",
            date: "2024-08-19",
          },
          {
            id: 105,
            user: "David",
            text: "Take it slow the first day and you'll be fine. Coca tea helps!",
            date: "2024-08-20",
          },
        ],
        experienceId: 5,
      },
      {
        id: 6,
        user: "Anna",
        text: "We got lucky with clear skies for 3 nights straight! Aurora was dancing like crazy.",
        date: "2024-02-10",
        likes: 14,
        liked: false,
        replies: [],
        experienceId: 6,
      },
      {
        id: 7,
        user: "Jake",
        text: "The sunrise hike was tough but the view from the top was worth the 4am start!",
        date: "2024-09-12",
        likes: 11,
        liked: false,
        replies: [],
        experienceId: 7,
      },
      {
        id: 8,
        user: "Lisa",
        text: "Hamilton was absolutely phenomenal! The talent on Broadway is unmatched.",
        date: "2024-11-05",
        likes: 7,
        liked: false,
        replies: [
          {
            id: 106,
            user: "Tom",
            text: "How did you get tickets? They seem so hard to find!",
            date: "2024-11-06",
          },
        ],
        experienceId: 8,
      },
      {
        id: 9,
        user: "Chris",
        text: "Dune bashing was thrilling! The camp dinner under the stars was magical too.",
        date: "2024-01-22",
        likes: 10,
        liked: false,
        replies: [],
        experienceId: 9,
      },
      {
        id: 10,
        user: "Rachel",
        text: "Perfect for couples! The wine pairing made it even more special.",
        date: "2024-06-17",
        likes: 6,
        liked: false,
        replies: [],
        experienceId: 1,
      },
      {
        id: 11,
        user: "Hiroshi",
        text: "As a local, I can say this tea house is authentic. Great choice!",
        date: "2024-03-28",
        likes: 13,
        liked: false,
        replies: [],
        experienceId: 2,
      },
      {
        id: 12,
        user: "Isabella",
        text: "The gothic quarter has so much history. Loved every bite!",
        date: "2024-05-12",
        likes: 8,
        liked: false,
        replies: [],
        experienceId: 3,
      },
    ];
  };

  const [comments, setComments] = useState<Comment[]>(
    loadCommentsFromStorage()
  );
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [bodyOverflow, setBodyOverflow] = useState<string | null>(null);
  const [replying, setReplying] = useState<{ [id: number]: boolean }>({});
  const [replies, setReplies] = useState<{ [id: number]: string }>({});
  const [replyUserNames, setReplyUserNames] = useState<{
    [id: number]: string;
  }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("travel-blog-comments", JSON.stringify(comments));
    }
  }, [comments]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 60, transition: { duration: 0.4, ease: "easeIn" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7 }
    }
  };

  const destinations: Destination[] = [
    {
      id: 1,
      name: "Santorini, Greece",
      description:
        "A breathtaking island known for its stunning white buildings, blue domes, and spectacular sunsets over the Aegean Sea. The perfect blend of relaxation and adventure.",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
      country: "Greece",
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      description:
        "Ancient temples, traditional gardens, and the famous bamboo forest make Kyoto a magical place to experience Japanese culture and history.",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
      country: "Japan",
    },
    {
      id: 3,
      name: "Barcelona, Spain",
      description:
        "A vibrant city with unique architecture by Gaudí, delicious tapas, and beautiful beaches all in one place. The perfect urban vacation destination.",
      image:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
      country: "Spain",
    },
    {
      id: 4,
      name: "Paris, France",
      description:
        "The City of Light captivates with its romantic atmosphere, world-class museums, and iconic landmarks like the Eiffel Tower and Louvre.",
      image:
        "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      country: "France",
    },
    {
      id: 5,
      name: "Cuzco, Peru",
      description:
        "This ancient Incan citadel perched high in the Andes Mountains offers breathtaking views and a glimpse into pre-Columbian history.",
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop",
      country: "Peru",
    },
    {
      id: 6,
      name: "Reykjavik, Iceland",
      description:
        "A gateway to natural wonders including the Northern Lights, geysers, and dramatic volcanic landscapes in the land of fire and ice.",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      country: "Iceland",
    },
    {
      id: 7,
      name: "Bali, Indonesia",
      description:
        "Tropical paradise with stunning rice terraces, ancient temples, pristine beaches, and vibrant Hindu culture creating an unforgettable experience.",
      image:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      country: "Indonesia",
    },
    {
      id: 8,
      name: "New York City, USA",
      description:
        "The city that never sleeps offers world-class entertainment, diverse neighborhoods, iconic skylines, and endless cultural experiences.",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
      country: "USA",
    },
    {
      id: 9,
      name: "Dubai, UAE",
      description:
        "A futuristic metropolis where traditional Arabian culture meets modern luxury, featuring stunning architecture and desert adventures.",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
      country: "UAE",
    },
  ];

  const experiences: Experience[] = [
    {
      id: 1,
      title: "Sunset Sailing in Santorini",
      description:
        "We booked a sunset sailing tour around the caldera. The views were absolutely breathtaking as the sun painted the white buildings in gold and pink. The crew served local wine and Greek appetizers while we enjoyed the scenery.",
      date: "June 12, 2024",
      image:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=500&fit=crop",
      rating: 4.8,
      totalRatings: 124,
    },
    {
      id: 2,
      title: "Tea Ceremony in Kyoto",
      description:
        "I participated in a traditional Japanese tea ceremony in a historic teahouse. The attention to detail and mindfulness in every movement was fascinating. The matcha was bitter but delicious.",
      date: "March 22, 2024",
      image:
        "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&h=500&fit=crop",
      rating: 4.9,
      totalRatings: 89,
    },
    {
      id: 3,
      title: "Tapas Tour in Barcelona",
      description:
        "We joined a local food tour through the Gothic Quarter, sampling different tapas and learning about Spanish cuisine. The patatas bravas and jamón ibérico were highlights, paired with excellent local wines.",
      date: "May 5, 2024",
      image:
        "https://images.unsplash.com/photo-1720804273933-976a0758b7fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.7,
      totalRatings: 156,
    },
    {
      id: 4,
      title: "Seine River Cruise in Paris",
      description:
        "An evening cruise along the Seine offered magical views of illuminated landmarks. The Eiffel Tower sparkled on the hour while we enjoyed champagne and French pastries aboard the glass-topped boat.",
      date: "April 18, 2024",
      image:
        "https://images.unsplash.com/photo-1622660515771-2f78f3b7aaba?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.6,
      totalRatings: 203,
    },
    {
      id: 5,
      title: "Hiking the Inca Trail",
      description:
        "The four-day trek to Machu Picchu was challenging but rewarding. Each day revealed new landscapes, from cloud forests to ancient ruins. Reaching the Sun Gate at sunrise was an unforgettable moment.",
      date: "August 15, 2024",
      image:
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=500&fit=crop",
      rating: 4.9,
      totalRatings: 67,
    },
    {
      id: 6,
      title: "Northern Lights in Iceland",
      description:
        "We spent three nights chasing the Aurora Borealis around Reykjavik. On the final night, the sky erupted in green and purple ribbons that danced for hours. Hot chocolate and traditional stories by the fire completed the experience.",
      date: "February 8, 2024",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      totalRatings: 91,
    },
    {
      id: 7,
      title: "Sunrise at Mount Batur, Bali",
      description:
        "We hiked through the darkness to reach the summit of this active volcano for sunrise. The panoramic views of Lake Batur and surrounding mountains were spectacular, especially with the golden light painting the landscape.",
      date: "September 10, 2024",
      image:
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=500&fit=crop",
      rating: 4.7,
      totalRatings: 143,
    },
    {
      id: 8,
      title: "Broadway Show in NYC",
      description:
        "Watching a Broadway musical in Times Square was pure magic. The energy of the performers, the elaborate costumes, and the intimate theater setting created an emotional experience I'll never forget.",
      date: "November 3, 2024",
      image:
        "https://images.unsplash.com/photo-1504913659239-6abc87875a63?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      totalRatings: 178,
    },
    {
      id: 9,
      title: "Desert Safari in Dubai",
      description:
        "A thrilling dune bashing adventure followed by a traditional Bedouin camp experience. We enjoyed camel rides, henna painting, and a feast under the stars while watching belly dancers perform.",
      date: "January 20, 2024",
      image:
        "https://images.unsplash.com/photo-1624062999726-083e5268525d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.5,
      totalRatings: 87,
    },
  ];

  const galleryImages: GalleryImage[] = [
    {
      url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop",
      postedBy: "Alex",
      location: "Santorini, Greece",
      date: "2025-05-10",
      size: "wide",
      description:
        "Iconic white buildings with blue domes overlooking the Aegean Sea",
    },
    {
      url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop",
      postedBy: "Emma",
      location: "Kyoto, Japan",
      date: "2025-05-12",
      size: "tall",
      description:
        "Traditional bamboo forest paths creating natural green tunnels",
    },
    {
      url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop",
      postedBy: "Michael",
      location: "Barcelona, Spain",
      date: "2025-05-15",
      size: "square",
      description: "Gaudí's masterful architecture blending art with nature",
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      postedBy: "Alex",
      location: "Santorini, Greece",
      date: "2025-05-10",
      size: "square",
      description: "Stunning sunset views from the volcanic cliffs of Oia",
    },
    {
      url: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=400&fit=crop",
      postedBy: "Emma",
      location: "Kyoto, Japan",
      date: "2025-05-12",
      size: "tall",
      description: "Ancient temples surrounded by peaceful zen gardens",
    },
    {
      url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
      postedBy: "Michael",
      location: "Barcelona, Spain",
      date: "2025-05-15",
      size: "wide",
      description: "Vibrant street life in the historic Gothic Quarter",
    },
    {
      url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&h=400&fit=crop",
      postedBy: "Alex",
      location: "Bali, Indonesia",
      date: "2025-05-10",
      size: "square",
      description: "Pristine beaches with crystal clear turquoise waters",
    },
    {
      url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
      postedBy: "Emma",
      location: "New York City, USA",
      date: "2025-05-12",
      size: "square",
      description: "The iconic Manhattan skyline from Central Park",
    },
    {
      url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
      postedBy: "Michael",
      location: "Dubai, UAE",
      date: "2025-05-15",
      size: "tall",
      description: "Modern architectural marvels reaching into the sky",
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      postedBy: "Jake",
      location: "Cuzco, Peru",
      date: "2025-04-28",
      size: "wide",
      description: "Majestic Andean peaks surrounding the ancient Inca capital",
    },
    {
      url: "https://images.unsplash.com/photo-1585944285854-d06c019aaca3?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      postedBy: "Emma",
      location: "Paris, France",
      date: "2025-04-25",
      size: "square",
      description: "Classic Haussmann architecture along the Seine River",
    },
    {
      url: "https://images.unsplash.com/photo-1524396309943-e03f5249f002?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      postedBy: "David",
      location: "Paris, France",
      date: "2025-04-22",
      size: "square",
      description: "Charming cobblestone streets in Montmartre district",
    },
    {
      url: "https://images.unsplash.com/photo-1607045914798-0a9eff3845c4?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      postedBy: "Sophie",
      location: "Cuzco, Peru",
      date: "2025-04-20",
      size: "tall",
      description: "Dramatic mountain landscapes on the way to Machu Picchu",
    },
    {
      url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&h=400&fit=crop",
      postedBy: "Mark",
      location: "Reykjavik, Iceland",
      date: "2025-04-18",
      size: "wide",
      description: "Breathtaking Northern Lights dancing across the Arctic sky",
    },
    {
      url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&h=400&fit=crop",
      postedBy: "Anna",
      location: "Reykjavik, Iceland",
      date: "2025-04-15",
      size: "square",
      description: "Geothermal hot springs and volcanic landscapes",
    },
    {
      url: "https://images.unsplash.com/photo-1559305289-4c31700ba9cb?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      postedBy: "Chris",
      location: "Bali, Indonesia",
      date: "2025-04-12",
      size: "square",
      description: "Emerald green rice terraces carved into hillsides",
    },
  ];

  useEffect(() => {
    if (selectedDestination || selectedImage || selectedExperience) {
      setBodyOverflow(document.body.style.overflow);
      document.body.style.overflow = "hidden";
    } else if (bodyOverflow !== null) {
      document.body.style.overflow = bodyOverflow;
      setBodyOverflow(null);
    }
  }, [selectedDestination, selectedImage, selectedExperience]);

  const handleLike = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
              liked: !comment.liked,
            }
          : comment
      )
    );
  };

  const openImageModal = (img: GalleryImage) => setSelectedImage(img);
  const closeImageModal = () => setSelectedImage(null);
  const openDestinationDetail = (destination: Destination) =>
    setSelectedDestination(destination);
  const closeDestinationDetail = () => setSelectedDestination(null);
  const openExperienceDetail = (experience: Experience) =>
    setSelectedExperience(experience);
  const closeExperienceDetail = () => setSelectedExperience(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const header = document.querySelector(".travelblog-header") as HTMLElement;

    if (element && header) {
      const headerHeight = header.offsetHeight;
      const extraOffset = sectionId === "destinations" ? 0 : 20;
      const elementPosition = element.offsetTop - headerHeight - extraOffset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const handleDestinationsToggle = () => {
    if (showAllDestinations) {
      setIsCollapsing((prev) => ({ ...prev, destinations: true }));
      setTimeout(() => {
        setShowAllDestinations(false);
        setTimeout(() => {
          setIsCollapsing((prev) => ({ ...prev, destinations: false }));
        }, 100);
      }, 600);
    } else {
      setShowAllDestinations(true);
    }
  };

  const handleExperiencesToggle = () => {
    if (showAllExperiences) {
      setIsCollapsing((prev) => ({ ...prev, experiences: true }));
      setTimeout(() => {
        setShowAllExperiences(false);
        setTimeout(() => {
          setIsCollapsing((prev) => ({ ...prev, experiences: false }));
        }, 100);
      }, 900);
    } else {
      setShowAllExperiences(true);
    }
  };

  const rootClass = `travelblog-root${darkMode ? " travelblog-dark" : ""}`;

  return (
    <div className={rootClass}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");
        body, .travelblog-root {
          font-family: 'Outfit';
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          color: #22223b;
          transition: background 0.5s, color 0.5s;
        }
        .travelblog-dark {
          background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%);
          color: #e2e8f0;
        }
        .travelblog-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(255,255,255,0.95);
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: background 0.5s;
        }
        .travelblog-dark .travelblog-header {
          background: rgba(2,6,23,0.95);
          border-bottom: 1px solid #334155;
        }
        .travelblog-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(90deg, #3b82f6, #34d399, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .travelblog-section-title {
          font-size: 3.6rem;
          font-weight: 700;
          background: linear-gradient(90deg, #3b82f6, #34d399, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .travelblog-dark .travelblog-title {
          background: linear-gradient(90deg, #60a5fa, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .travelblog-dark .travelblog-section-title {
          background: linear-gradient(90deg, #60a5fa, #34d399, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .travelblog-nav {
          display: flex;
          gap: 24px;
        }
        .travelblog-nav-btn {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: inherit;
          font-weight: 400;
          padding: 8px 16px;
          border-radius: 8px;
          position: relative;
          transition: color 0.2s, background 0.2s;
        }
        .travelblog-nav-btn::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #14b8a6);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .travelblog-nav-btn:hover::after {
          width: calc(100% - 32px);
        }
        .travelblog-nav-btn:hover {
          color: #3b82f6;
        }
        .travelblog-dark .travelblog-nav-btn:hover {
          color: #60a5fa;
        }
        .travelblog-nav-btn.active {
          color: #3b82f6;
          font-weight: 600;
        }
        .travelblog-nav-btn.active::after {
          width: calc(100% - 32px);
        }
        .travelblog-main {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .travelblog-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          grid-auto-rows: 280px;
          grid-auto-flow: dense;
          gap: 24px;
        }
        @media (min-width: 1200px) {
          .travelblog-gallery-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (min-width: 900px) and (max-width: 1199px) {
          .travelblog-gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .travelblog-gallery-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          cursor: pointer;
          background: #fff;
          animation: galleryFadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .travelblog-gallery-card.wide {
          grid-column: span 2;
          grid-row: span 1;
        }
        .travelblog-gallery-card.tall {
          grid-column: span 1;
          grid-row: span 2;
        }
        .travelblog-gallery-card.square {
          grid-column: span 1;
          grid-row: span 1;
        }
        .travelblog-dark .travelblog-gallery-card {
          background: #1e293b;
        }
        @keyframes galleryFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97);}
          to   { opacity: 1; transform: translateY(0) scale(1);}
        }
        .travelblog-gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s cubic-bezier(.4,0,.2,1), filter 0.35s cubic-bezier(.4,0,.2,1);
          will-change: transform, filter;
          display: block;
        }
        .travelblog-gallery-card:hover .travelblog-gallery-img {
          transform: scale(1.09) rotate(-1deg);
          filter: brightness(0.85) blur(1px);
        }
        .travelblog-gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(34,34,59,0.85) 70%, rgba(34,34,59,0.1) 100%);
          color: #fff;
          opacity: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 18px 18px 14px 18px;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .travelblog-gallery-card:hover .travelblog-gallery-overlay {
          opacity: 1;
          pointer-events: auto;
        }
        .travelblog-gallery-overlay .gallery-location {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 2px;
          color: #facc15;
          text-shadow: 0 2px 8px rgba(0,0,0,0.22);
        }
        .travelblog-gallery-overlay .gallery-meta {
          font-size: 0.95rem;
          color: #fff;
          opacity: 0.85;
          text-shadow: 0 2px 8px rgba(0,0,0,0.22);
        }
        .travelblog-modal::-webkit-scrollbar { display: none; }
        .travelblog-modal { scrollbar-width: none; -ms-overflow-style: none; }
        .travelblog-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
          backdrop-filter: blur(2px);
        }
        .travelblog-modal-content {
          position: relative;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.5);
          padding: 24px;
          max-width: 800px;
          max-height: 90vh;
        }
        .travelblog-dark .travelblog-modal-content {
          background: #1e293b;
          color: #e2e8f0;
        }
        .travelblog-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .travelblog-hamburger:hover {
          background: rgba(59, 130, 246, 0.1);
        }
        .travelblog-mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 60;
          display: none;
          backdrop-filter: blur(2px);
        }
        .travelblog-mobile-menu.open {
          display: block;
        }
        .travelblog-mobile-menu-content {
          position: absolute;
          top: 0;
          right: 0;
          height: 100vh;
          width: 280px;
          background: #fff;
          box-shadow: -4px 0 16px rgba(0,0,0,0.1);
          padding: 24px;
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
        }
        .travelblog-dark .travelblog-mobile-menu-content {
          background: #1e293b;
        }
        .travelblog-mobile-menu.open .travelblog-mobile-menu-content {
          transform: translateX(0);
        }
        .travelblog-mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 48px;
        }
        .travelblog-mobile-nav-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: inherit;
          font-weight: 500;
          padding: 12px 0;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          transition: color 0.2s;
        }
        .travelblog-dark .travelblog-mobile-nav-btn {
          border-bottom-color: #334155;
        }
        .travelblog-mobile-nav-btn.active {
          color: #3b82f6;
          font-weight: 600;
        }
        .travelblog-mobile-nav button {
          position: relative;
          overflow: hidden;
        }
        .travelblog-mobile-nav button::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #14b8a6);
          transition: width 0.3s ease;
        }
        .travelblog-mobile-nav button:hover::after {
          width: 100%;
        }
        .travelblog-mobile-nav button:hover {
          color: #3b82f6 !important;
        }
        .travelblog-dark .travelblog-mobile-nav button:hover {
          color: #60a5fa !important;
        }
        .travelblog-footer-links {
          display: flex;
          gap: 32px;
        }
        .travelblog-experience-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .travelblog-experience-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .travelblog-experience-content {
          padding: 24px;
        }

        @media (max-width: 768px) {
          .travelblog-nav {
            display: none;
          }
          .travelblog-hamburger {
            display: block;
          }
          .travelblog-footer-content {
            flex-direction: column !important;
            gap: 24px !important;
            text-align: left !important;
            align-items: flex-start !important;
          }
          .travelblog-footer-links {
            align-items: flex-start !important;
          }
          .travelblog-footer-content > div:first-child {
            align-items: flex-start !important;
          }

        }
        @media (max-width: 768px) {
          .travelblog-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 200px !important;
            gap: 16px !important;
          }
          .travelblog-gallery-card.wide {
            grid-column: span 2 !important;
            grid-row: span 1 !important;
          }
          .travelblog-gallery-card.tall {
            grid-column: span 1 !important;
            grid-row: span 2 !important;
          }
          .travelblog-gallery-card.square {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
        @media (max-width: 600px) {
          .travelblog-gallery-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 250px !important;
          }
          .travelblog-gallery-card.wide,
          .travelblog-gallery-card.tall,
          .travelblog-gallery-card.square {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
          .travelblog-gallery-img { min-height: 120px; }
          .travelblog-modal-content { padding: 8px !important; }
        }
        ::-webkit-scrollbar {
    display: none;
}
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
        
        .hero-content {
          padding-left: 0;
        }
        
        .hero-title {
          font-size: 80px;
        }
        
        @media (max-width: 768px) {
          .hero-content {
            padding-left: 0 !important;
          }
          .hero-title {
            font-size: 56px !important;
          }
          .travelblog-section-title {
            font-size: 2.8rem !important;
          }
          .travelblog-main {
            padding: 0 1rem !important;
          }
          .travelblog-header > div {
            padding: 1rem 1rem !important;
          }
          .travelblog-footer > div {
            padding: 0 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .travelblog-section-title {
            font-size: 2.2rem !important;
          }
          .travelblog-main {
            padding: 0 0.75rem !important;
          }
          .travelblog-header > div {
            padding: 1rem 0.75rem !important;
          }
          .travelblog-footer > div {
            padding: 0 0.75rem !important;
          }
        }
        @media (max-width: 768px) {
          .travelblog-footer-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 32px !important;
            text-align: left !important;
          }
          .travelblog-footer-flex > div {
            width: 100% !important;
            min-width: 0 !important;
            align-items: flex-start !important;
            padding: 0 !important;
          }
        }
        .experience-title-date {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-direction: row;
        }
        @media (max-width: 600px) {
          .experience-title-date {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
            flex-wrap: wrap !important;
            width: 100% !important;
          }
          .experience-title-date span {
            margin-left: 0 !important;
            align-self: flex-start !important;
            width: auto !important;
          }
        }
      `}</style>

      <motion.header
        className="travelblog-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1400,
            margin: "0 auto",
            padding: "1rem 2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <Camera size={24} style={{ color: "#3b82f6", marginRight: 8 }} />
            <span className="travelblog-title">WanderLens</span>
          </div>
          <nav className="travelblog-nav">
            <button
              className="travelblog-nav-btn"
              onClick={() => scrollToSection("destinations")}
              style={{ fontSize: 16, fontWeight: 500 }}
            >
              Destinations
            </button>
            <button
              className="travelblog-nav-btn"
              onClick={() => scrollToSection("experiences")}
              style={{ fontSize: 16, fontWeight: 500 }}
            >
              Experiences
            </button>
            <button
              className="travelblog-nav-btn"
              onClick={() => scrollToSection("gallery")}
              style={{ fontSize: 16, fontWeight: 500 }}
            >
              Gallery
            </button>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setDarkMode((d) => !d)}
              style={{
                background: "none",
                border: "none",
                borderRadius: "50%",
                padding: 8,
                cursor: "pointer",
              }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} color="#facc15" />
              ) : (
                <Moon size={20} color="#3b82f6" />
              )}
            </button>
            <button
              className="travelblog-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} color={darkMode ? "#fff" : "#3b82f6"} />
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`travelblog-mobile-menu${mobileMenuOpen ? " open" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="travelblog-mobile-menu-content"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 600 }}>Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: "50%",
                  }}
                  aria-label="Close menu"
                >
                  <X size={24} color={darkMode ? "#e2e8f0" : "#22223b"} />
                </button>
              </div>
              <nav className="travelblog-mobile-nav">
                <button
                  onClick={() => {
                    scrollToSection("destinations");
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    padding: "12px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Destinations
                </button>
                <button
                  onClick={() => {
                    scrollToSection("experiences");
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    padding: "12px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Experiences
                </button>
                <button
                  onClick={() => {
                    scrollToSection("gallery");
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    padding: "12px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Gallery
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <section
        style={{
          height: "100vh",
          position: "relative",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1400,
            width: "100%",
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <motion.div
            style={{
              maxWidth: 600,
            }}
            className="hero-content"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              style={{
                fontSize: 80,
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 24,
                color: "#ffffff",
              }}
              className="hero-title"
            >
              Discover the World Through WanderLens
            </motion.h1>

            <p
              style={{
                fontSize: 20,
                lineHeight: 1.6,
                marginBottom: 32,
                color: "#e2e8f0",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                maxWidth: 500,
              }}
            >
              Embark on extraordinary journeys and capture breathtaking moments.
              From hidden gems to iconic destinations, let us inspire your next
              adventure.
            </p>

            <button
              style={{
                background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                color: "#fff",
                border: "none",
                borderRadius: 24,
                padding: "16px 32px",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.4)",
                transition: "transform 0.3s, box-shadow 0.3s",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(-2px)";
                (e.target as HTMLElement).style.boxShadow =
                  "0 12px 40px rgba(59, 130, 246, 0.6)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "translateY(0)";
                (e.target as HTMLElement).style.boxShadow =
                  "0 8px 32px rgba(59, 130, 246, 0.4)";
              }}
              onClick={() => scrollToSection("destinations")}
            >
              Start Exploring
            </button>
          </motion.div>
        </div>
      </section>

      <motion.main
        className="travelblog-main"
        style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem" }}
        initial="initial"
        whileInView="animate"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <motion.section
          id="destinations"
          style={{ marginBottom: 80, paddingTop: 59 }}
          initial="hidden"
          whileInView="show"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <motion.h2
            className="travelblog-section-title"
            style={{ textAlign: "center", marginBottom: 32 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Destinations
          </motion.h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32,
            }}
          >
            <AnimatePresence mode="popLayout">
              {(showAllDestinations || isCollapsing.destinations
                ? destinations
                : destinations.slice(0, 6)
              )
                .filter(Boolean)
                .map((destination, index) =>
                  destination ? (
                    <motion.div
                      key={destination.id}
                      style={{
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        background: darkMode ? "#1e293b" : "#fff",
                        cursor: "pointer",
                      }}
                      variants={staggerItem}
                      viewport={{ once: true }}
                      exit={{
                        opacity: 0,
                        y: -60,
                        scale: 0.9,
                        transition: {
                          duration: 0.4,
                          delay: index > 5 ? (index - 6) * 0.1 : 0,
                        },
                      }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openDestinationDetail(destination)}
                    >
                      <div
                        style={{
                          height: 192,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={destination.image}
                          alt={destination.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                          }}
                        />
                      </div>
                      <div style={{ padding: 24 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                          }}
                        >
                          <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                            {destination.name}
                          </h3>
                          <span
                            style={{
                              fontSize: 14,
                              padding: "4px 12px",
                              borderRadius: 12,
                              background: darkMode ? "#1e40af" : "#dbeafe",
                              color: darkMode ? "#bfdbfe" : "#2563eb",
                            }}
                          >
                            {destination.country}
                          </span>
                        </div>
                        <p
                          style={{
                            marginBottom: 16,
                            color: darkMode ? "#cbd5e1" : "#4b5563",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {destination.description.length > 120
                            ? `${destination.description.substring(0, 120)}...`
                            : destination.description}
                        </p>
                      </div>
                    </motion.div>
                  ) : null
                )}
            </AnimatePresence>
          </div>
          {destinations.length > 6 && (
            <motion.div
              style={{ textAlign: "center", marginTop: 32 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={handleDestinationsToggle}
                style={{
                  background: darkMode ? "#3b82f6" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "12px 24px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: darkMode ? "#2563eb" : "#2563eb",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllDestinations ? "See Less" : "See More"}
              </motion.button>
            </motion.div>
          )}
        </motion.section>

        <motion.section
          id="experiences"
          style={{ marginBottom: 80 }}
          initial="hidden"
          whileInView="show"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <motion.h2
            className="travelblog-section-title"
            style={{ textAlign: "center", marginBottom: 32 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Travel Experiences
          </motion.h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32,
            }}
          >
            <AnimatePresence mode="popLayout">
              {(showAllExperiences || isCollapsing.experiences
                ? experiences
                : experiences.slice(0, 6)
              ).map((experience, index) => (
                <motion.div
                  key={experience.id}
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    background: darkMode ? "#1e293b" : "#fff",
                    cursor: "pointer",
                  }}
                  variants={staggerItem}
                  viewport={{ once: true }}
                  exit={{
                    opacity: 0,
                    y: -60,
                    scale: 0.9,
                    transition: {
                      duration: 0.4,
                      delay: index > 5 ? (index - 6) * 0.1 : 0,
                    },
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openExperienceDetail(experience)}
                >
                  <div
                    style={{
                      height: 200,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={experience.image}
                      alt={experience.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s",
                      }}
                    />
                  </div>
                  <div style={{ padding: 24 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                        {experience.title}
                      </h3>
                      <span
                        style={{
                          fontSize: 14,
                          padding: "4px 12px",
                          borderRadius: 12,
                          background: darkMode ? "#334155" : "#f3f4f6",
                          color: darkMode ? "#cbd5e1" : "#6b7280",
                        }}
                      >
                        {experience.date}
                      </span>
                    </div>
                    <p
                      style={{
                        color: darkMode ? "#cbd5e1" : "#4b5563",
                        lineHeight: 1.6,
                      }}
                    >
                      {experience.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {experiences.length > 6 && (
            <motion.div
              style={{ textAlign: "center", marginTop: 32 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={handleExperiencesToggle}
                style={{
                  background: darkMode ? "#3b82f6" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "12px 24px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: darkMode ? "#2563eb" : "#2563eb",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllExperiences ? "See Less" : "See More"}
              </motion.button>
            </motion.div>
          )}
        </motion.section>

        <motion.section
          id="gallery"
          style={{ marginBottom: 80 }}
          initial="hidden"
          whileInView="show"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <motion.h2
            className="travelblog-section-title"
            style={{ textAlign: "center", marginBottom: 32 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Photo Gallery
          </motion.h2>
          <div className="travelblog-gallery-grid">
            {galleryImages.map((img, index) => (
              <motion.div
                key={`gallery-${index}`}
                className={`travelblog-gallery-card ${img.size}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openImageModal(img)}
              >
                <img
                  src={img.url}
                  alt={`Travel photo ${index + 1}`}
                  className="travelblog-gallery-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div className="travelblog-gallery-overlay">
                  <div className="gallery-location">{img.location}</div>
                  <div className="gallery-meta">
                    By {img.postedBy} &nbsp;|&nbsp; {img.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.main>

      <motion.footer
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #1e293b 0%, #1e3a5f 50%, #1e293b 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e0f2fe 50%, #f1f5f9 75%, #f8fafc 100%)",
          color: darkMode ? "#cbd5e1" : "#6b7280",
          padding: "64px 0 48px 0",
          marginTop: 64,
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: 40,
          }}
        >
          <div
            className="travelblog-footer-flex"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 56,
              padding: "0 0 16px 0",
            }}
          >
            <motion.div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                padding: "8px 0",
              }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                style={{ display: "flex", alignItems: "center", gap: 12 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Camera size={24} style={{ color: "#3b82f6" }} />
                <span className="travelblog-title">WanderLens</span>
              </motion.div>
              <p
                style={{
                  margin: 0,
                  maxWidth: 400,
                  lineHeight: 1.6,
                  color: darkMode ? "#94a3b8" : "#6b7280",
                  fontSize: 16,
                }}
              >
                Discover breathtaking destinations and unforgettable experiences
                through the lens of passionate travelers. Your gateway to
                wanderlust and adventure.
              </p>
            </motion.div>

            <motion.div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "flex-end",
                minWidth: 160,
                padding: "8px 0",
              }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontWeight: 600,
                  color: darkMode ? "#e2e8f0" : "#374151",
                  fontSize: 18,
                }}
              >
                Quick Links
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 15,
                }}
              >
                <motion.button
                  onClick={() => scrollToSection("destinations")}
                  style={{
                    background: "none",
                    border: "none",
                    color: darkMode ? "#cbd5e1" : "#6b7280",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 15,
                    padding: "4px 0",
                    transition: "color 0.2s",
                  }}
                  whileHover={{ color: "#3b82f6" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Destinations
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection("experiences")}
                  style={{
                    background: "none",
                    border: "none",
                    color: darkMode ? "#cbd5e1" : "#6b7280",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 15,
                    padding: "4px 0",
                    transition: "color 0.2s",
                  }}
                  whileHover={{ color: "#3b82f6" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Experiences
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection("gallery")}
                  style={{
                    background: "none",
                    border: "none",
                    color: darkMode ? "#cbd5e1" : "#6b7280",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 15,
                    padding: "4px 0",
                    transition: "color 0.2s",
                  }}
                  whileHover={{ color: "#3b82f6" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Photo Gallery
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "flex-start",
                minWidth: 220,
                padding: "8px 0",
              }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontWeight: 600,
                  color: darkMode ? "#e2e8f0" : "#374151",
                  fontSize: 18,
                }}
              >
                Contact Us
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 15,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={16} color={darkMode ? "#60a5fa" : "#3b82f6"} />
                  <span>hello@wanderlens.com</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Phone size={16} color={darkMode ? "#60a5fa" : "#3b82f6"} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={16} color={darkMode ? "#60a5fa" : "#3b82f6"} />
                  <span>San Francisco, CA</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    marginTop: 12,
                    alignItems: "center",
                  }}
                >
                  <motion.a
                    href="#"
                    style={{
                      color: darkMode ? "#60a5fa" : "#3b82f6",
                      display: "flex",
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 5,
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram size={20} />
                  </motion.a>
                  <motion.a
                    href="#"
                    style={{
                      color: darkMode ? "#60a5fa" : "#3b82f6",
                      display: "flex",
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: -5,
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Twitter size={20} />
                  </motion.a>
                  <motion.a
                    href="#"
                    style={{
                      color: darkMode ? "#60a5fa" : "#3b82f6",
                      display: "flex",
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 5,
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Facebook size={20} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            style={{
              borderTop: `1px solid ${darkMode ? "#334155" : "#e5e7eb"}`,
              paddingTop: 24,
              textAlign: "center",
              fontSize: 14,
              color: darkMode ? "#94a3b8" : "#000000",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p style={{ margin: 0 }}>© 2025 WanderLens. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>

      {selectedImage && (
        <div className="travelblog-modal" onClick={closeImageModal}>
          <div
            className="travelblog-modal-content"
            style={{ position: "relative" }}
          >
            <img
              src={selectedImage.url}
              alt="Gallery preview"
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
                objectFit: "contain",
                borderRadius: 12,
                boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
              }}
            />
            <div
              style={{ marginTop: 16, color: darkMode ? "#e2e8f0" : "#22223b" }}
            >
              <p
                style={{
                  fontSize: 17,
                  fontStyle: "italic",
                  marginBottom: 12,
                  lineHeight: 1.4,
                }}
              >
                {selectedImage.description}
              </p>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                <b>Posted by:</b> {selectedImage.postedBy} &nbsp; | &nbsp;
                <b>Location:</b> {selectedImage.location} &nbsp; | &nbsp;
                <b>Date:</b> {selectedImage.date}
              </div>
            </div>
            <button
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                padding: 12,
                cursor: "pointer",
              }}
              onClick={closeImageModal}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
      {selectedDestination && (
        <div className="travelblog-modal" onClick={closeDestinationDetail}>
          <div
            className="travelblog-modal-content"
            style={{
              position: "relative",
              maxWidth: 600,
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
              background: darkMode ? "#23233a" : "#fff",
              boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: 256, overflow: "hidden" }}>
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: 32 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <h2 style={{ fontSize: 28, fontWeight: 700 }}>
                  {selectedDestination.name}
                </h2>
                <span
                  style={{
                    fontSize: 14,
                    padding: "4px 12px",
                    borderRadius: 12,
                    background: darkMode ? "#1e40af" : "#dbeafe",
                    color: darkMode ? "#bfdbfe" : "#2563eb",
                  }}
                >
                  {selectedDestination.country}
                </span>
              </div>
              <p style={{ fontSize: 18, lineHeight: 1.6 }}>
                {selectedDestination.description}
              </p>
            </div>
            <button
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                padding: 12,
                cursor: "pointer",
              }}
              onClick={closeDestinationDetail}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
      {selectedExperience && (
        <div className="travelblog-modal" onClick={closeExperienceDetail}>
          <div
            className="travelblog-modal-content"
            style={{
              position: "relative",
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: 16,
              background: darkMode ? "#1e293b" : "#fff",
              boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                height: 256,
                overflow: "hidden",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <img
                src={selectedExperience.image}
                alt={selectedExperience.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: 32 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
                  {selectedExperience.title}
                </h2>
                <span
                  style={{
                    fontSize: 14,
                    padding: "4px 12px",
                    borderRadius: 12,
                    background: darkMode ? "#334155" : "#f3f4f6",
                    color: darkMode ? "#cbd5e1" : "#6b7280",
                    marginLeft: 16,
                  }}
                >
                  {selectedExperience.date}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={
                        star <= Math.floor(selectedExperience.rating)
                          ? "#facc15"
                          : "none"
                      }
                      color="#facc15"
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 600, fontSize: 16 }}>
                  {selectedExperience.rating}
                </span>
                <span
                  style={{
                    color: darkMode ? "#94a3b8" : "#6b7280",
                    fontSize: 14,
                  }}
                >
                  ({selectedExperience.totalRatings} reviews)
                </span>
              </div>

              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  marginBottom: 32,
                  color: darkMode ? "#cbd5e1" : "#4b5563",
                }}
              >
                {selectedExperience.description}
              </p>

              <div
                style={{
                  borderTop: `1px solid ${darkMode ? "#334155" : "#e5e7eb"}`,
                  paddingTop: 24,
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
                  Comments & Reviews
                </h3>

                <div
                  style={{
                    marginBottom: 24,
                    padding: 20,
                    borderRadius: 12,
                    background: darkMode ? "#334155" : "#f8fafc",
                    border: `1px solid ${darkMode ? "#475569" : "#e2e8f0"}`,
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 6,
                        border: `1px solid ${darkMode ? "#475569" : "#d1d5db"}`,
                        background: darkMode ? "#1e293b" : "#fff",
                        color: darkMode ? "#e2e8f0" : "#22223b",
                        marginBottom: 12,
                        fontSize: 14,
                      }}
                      placeholder="Your name"
                    />
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 6,
                        border: `1px solid ${darkMode ? "#475569" : "#d1d5db"}`,
                        background: darkMode ? "#1e293b" : "#fff",
                        color: darkMode ? "#e2e8f0" : "#22223b",
                        resize: "vertical",
                        fontSize: 14,
                      }}
                      rows={3}
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (newComment.trim() && userName.trim()) {
                        const newCommentObj: Comment = {
                          id: Date.now(),
                          user: userName,
                          text: newComment,
                          date: new Date().toISOString().split("T")[0],
                          likes: 0,
                          liked: false,
                          replies: [],
                          experienceId: selectedExperience.id,
                        };
                        setComments([newCommentObj, ...comments]);
                        setNewComment("");
                        setUserName("");
                      }
                    }}
                    disabled={!newComment.trim() || !userName.trim()}
                    style={{
                      padding: "8px 20px",
                      background: "linear-gradient(90deg, #3b82f6, #22d3ee)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontWeight: 500,
                      cursor: !newComment.trim() || !userName.trim() ? "not-allowed" : "pointer",
                      fontSize: 14,
                      opacity: !newComment.trim() || !userName.trim() ? 0.6 : 1,
                      //pointerEvents: !newComment.trim() || !userName.trim() ? "none" : "auto",
                    }}
                  >
                    Post Comment
                  </button>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {comments
                    .filter(
                      (comment) =>
                        comment.experienceId === selectedExperience.id
                    )
                    .map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          padding: 16,
                          borderRadius: 12,
                          background: darkMode ? "#334155" : "#f8fafc",
                          border: `1px solid ${
                            darkMode ? "#475569" : "#e2e8f0"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(90deg, #3b82f6, #22d3ee)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                            }}
                          >
                            <User size={16} />
                          </div>
                          <div style={{ marginLeft: 12 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {comment.user}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: darkMode ? "#94a3b8" : "#6b7280",
                              }}
                            >
                              {comment.date}
                            </div>
                          </div>
                        </div>
                        <p style={{ marginBottom: 8, fontSize: 14 }}>
                          {comment.text}
                        </p>
                        <button
                          onClick={() => handleLike(comment.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: comment.liked ? "#ef4444" : "#3b82f6",
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                          }}
                        >
                          <Heart
                            size={14}
                            fill={comment.liked ? "#ef4444" : "none"}
                          />
                          {comment.likes}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <button
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                padding: 12,
                cursor: "pointer",
              }}
              onClick={closeExperienceDetail}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
