import React, { useState, useMemo } from "react";
import { Typography, Card, Avatar, Button, Input, message, Modal, Tag } from "antd";
import { 
  HeartOutlined, 
  HeartFilled, 
  CommentOutlined, 
  ShareAltOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  SendOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Text } = Typography;
const { TextArea } = Input;

// Mock data cho blog posts
const initialBlogPosts = [
  {
    id: 2,
    title: "Phân biệt xét nghiệm DNA dân sự và hành chính", 
    summary: "Hiểu rõ sự khác biệt quan trọng giữa hai loại xét nghiệm DNA để chọn đúng dịch vụ.",
    content: "Xét nghiệm DNA dân sự và hành chính có những điểm khác biệt quan trọng về quy trình, giá trị pháp lý và mục đích sử dụng. Xét nghiệm DNA dân sự thường được sử dụng cho mục đích cá nhân, không có giá trị pháp lý. Trong khi đó, xét nghiệm DNA hành chính được thực hiện theo quy trình nghiêm ngặt, có giá trị pháp lý và được sử dụng trong các thủ tục tòa án, xác định quan hệ huyết thống cho các thủ tục pháp lý.",
    author: "TS. Lê Thị D",
    publishDate: "2024-12-10",
    readTime: "7 phút đọc",
    category: "Kiến thức",
    likes: 32,
    views: 890,
    comments: [
      {
        id: 3,
        author: "Phạm Văn E",
        content: "Giải thích rất rõ ràng, giúp mình hiểu được sự khác biệt.",
        date: "2024-12-11",
        likes: 2
      }
    ]
  },
  {
    id: 3,
    title: "Quy trình pháp lý xét nghiệm DNA tại Việt Nam",
    summary: "Hướng dẫn từng bước sử dụng kết quả xét nghiệm DNA trong các thủ tục pháp lý.",
    content: "Việc sử dụng kết quả xét nghiệm DNA trong các thủ tục pháp lý cần tuân thủ đúng quy trình và quy định của pháp luật Việt Nam. Quy trình bao gồm: đăng ký xét nghiệm tại cơ sở được cấp phép, thực hiện lấy mẫu theo đúng quy định, chờ kết quả và sử dụng kết quả trong các thủ tục pháp lý. Kết quả xét nghiệm DNA có giá trị pháp lý khi được thực hiện tại các cơ sở được Bộ Y tế cấp phép.",
    author: "Luật sư Hoàng Văn F",
    publishDate: "2024-12-05",
    readTime: "10 phút đọc",
    category: "Pháp lý",
    likes: 28,
    views: 675,
    comments: []
  },
  {
    id: 4,
    title: "Xét nghiệm DNA xác định quan hệ cha con",
    summary: "Tìm hiểu về xét nghiệm DNA xác định quan hệ cha con, độ chính xác và ý nghĩa pháp lý.",
    content: "Xét nghiệm DNA xác định quan hệ cha con là một trong những ứng dụng phổ biến nhất của công nghệ DNA. Xét nghiệm này có độ chính xác lên đến 99.99% khi xác định quan hệ cha con. Quy trình xét nghiệm bao gồm lấy mẫu từ cha và con, phân tích DNA tại phòng thí nghiệm và so sánh các marker di truyền. Kết quả xét nghiệm có thể được sử dụng trong các vụ việc pháp lý như xác định quyền nuôi con, thừa kế và các thủ tục hành chính khác.",
    author: "Dr. Phạm Thị G",
    publishDate: "2024-12-20",
    readTime: "8 phút đọc",
    category: "Kiến thức",
    likes: 67,
    views: 1580,
    comments: [
      {
        id: 4,
        author: "Lê Văn H",
        content: "Thông tin rất hữu ích cho những ai đang cần xét nghiệm.",
        date: "2024-12-21",
        likes: 4
      }
    ]
  },
  {
    id: 5,
    title: "Chi phí xét nghiệm DNA tại Việt Nam năm 2024",
    summary: "Tổng hợp bảng giá xét nghiệm DNA các loại tại Việt Nam, giúp bạn lựa chọn dịch vụ phù hợp.",
    content: "Chi phí xét nghiệm DNA tại Việt Nam dao động từ 2-10 triệu đồng tùy thuộc vào loại xét nghiệm và cơ sở thực hiện. Xét nghiệm DNA dân sự thường có giá thấp hơn, từ 2-4 triệu đồng. Xét nghiệm DNA hành chính có giá cao hơn, từ 5-10 triệu đồng do quy trình nghiêm ngặt hơn. Các yếu tố ảnh hưởng đến giá bao gồm: số lượng mẫu, loại quan hệ cần xác định, thời gian có kết quả và uy tín của cơ sở xét nghiệm.",
    author: "Chuyên gia Nguyễn Thị I",
    publishDate: "2024-12-18",
    readTime: "6 phút đọc",
    category: "Tư vấn",
    likes: 89,
    views: 2100,
    comments: [
      {
        id: 5,
        author: "Trần Thị K",
        content: "Cảm ơn bài viết, giúp mình có cái nhìn tổng quan về giá cả.",
        date: "2024-12-19",
        likes: 6
      },
      {
        id: 6,
        author: "Võ Văn L",
        content: "Thông tin rất chi tiết và cập nhật.",
        date: "2024-12-20",
        likes: 3
      }
    ]
  },
  {
    id: 6,
    title: "Xét nghiệm DNA trong việc xác định quan hệ anh chị em",
    summary: "Hướng dẫn về xét nghiệm DNA để xác định quan hệ anh chị em ruột và các trường hợp đặc biệt.",
    content: "Xét nghiệm DNA xác định quan hệ anh chị em phức tạp hơn xét nghiệm cha con do cần phân tích nhiều marker di truyền hơn. Có hai loại chính: xét nghiệm anh chị em ruột (cùng cha mẹ) và anh chị em cùng cha hoặc cùng mẹ. Độ chính xác của xét nghiệm này thường đạt 90-95%. Trong một số trường hợp, cần thêm mẫu DNA của cha mẹ để tăng độ chính xác. Xét nghiệm này thường được sử dụng trong các vụ việc thừa kế, nhận con nuôi và tìm kiếm người thân.",
    author: "TS. Đỗ Văn M",
    publishDate: "2024-12-12",
    readTime: "9 phút đọc",
    category: "Kiến thức",
    likes: 41,
    views: 920,
    comments: []
  },
  {
    id: 7,
    title: "Bảo mật thông tin trong xét nghiệm DNA",
    summary: "Tìm hiểu về các biện pháp bảo mật thông tin cá nhân và kết quả xét nghiệm DNA.",
    content: "Bảo mật thông tin trong xét nghiệm DNA là vấn đề cực kỳ quan trọng. Các cơ sở xét nghiệm uy tín phải tuân thủ nghiêm ngặt các quy định về bảo mật thông tin cá nhân. Thông tin DNA của bạn được mã hóa và lưu trữ an toàn, chỉ những người có thẩm quyền mới được truy cập. Kết quả xét nghiệm chỉ được cung cấp cho người đăng ký hoặc người được ủy quyền hợp pháp. Sau khi hoàn thành xét nghiệm, mẫu DNA sẽ được tiêu hủy theo quy định.",
    author: "Luật sư Bùi Thị N",
    publishDate: "2024-12-08",
    readTime: "7 phút đọc",
    category: "Pháp lý",
    likes: 35,
    views: 780,
    comments: [
      {
        id: 7,
        author: "Ngô Văn O",
        content: "Rất quan tâm đến vấn đề bảo mật, cảm ơn bài viết.",
        date: "2024-12-09",
        likes: 2
      }
    ]
  }
];

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likedComments, setLikedComments] = useState(new Set());
  const [newComment, setNewComment] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Get user info from Redux store
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = !!user;
  const isCustomer = user?.role === 'customer';
  const isGuest = !isLoggedIn;

  // Handle like post
  const handleLikePost = (postId) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để thích bài viết!");
      return;
    }

    const newLikedPosts = new Set(likedPosts);
    const isLiked = likedPosts.has(postId);
    
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    
    setLikedPosts(newLikedPosts);
    
    setBlogPosts(posts => posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + (isLiked ? -1 : 1) }
        : post
    ));

    message.success(isLiked ? "Đã bỏ thích bài viết" : "Đã thích bài viết");
  };

  // Handle like comment
  const handleLikeComment = (postId, commentId) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để thích bình luận!");
      return;
    }

    const commentKey = `${postId}-${commentId}`;
    const newLikedComments = new Set(likedComments);
    const isLiked = likedComments.has(commentKey);
    
    if (isLiked) {
      newLikedComments.delete(commentKey);
    } else {
      newLikedComments.add(commentKey);
    }
    
    setLikedComments(newLikedComments);
    
    setBlogPosts(posts => posts.map(post => 
      post.id === postId 
        ? {
            ...post, 
            comments: post.comments.map(comment => 
              comment.id === commentId 
                ? { ...comment, likes: comment.likes + (isLiked ? -1 : 1) }
                : comment
            )
          }
        : post
    ));
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!isCustomer) {
      message.warning("Chỉ khách hàng mới có thể bình luận!");
      return;
    }

    if (!newComment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }

    const comment = {
      id: Date.now(),
      author: user.fullName || user.username,
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };

    setBlogPosts(posts => posts.map(post => 
      post.id === selectedPost.id 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));

    setSelectedPost(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));

    setNewComment("");
    message.success("Đã thêm bình luận thành công!");
  };

  // Open post detail modal
  const openPostDetail = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
    
    // Increase view count
    setBlogPosts(posts => posts.map(p => 
      p.id === post.id 
        ? { ...p, views: p.views + 1 }
        : p
    ));
  };

  // Tối ưu hóa việc tính toán categories và filteredPosts với useMemo
  const categories = useMemo(() => {
    return ["all", ...new Set(blogPosts.map(post => post.category))];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    switch (sortBy) {
      case "oldest":
        return filtered.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
      case "popular":
        return filtered.sort((a, b) => b.views - a.views);
      case "liked":
        return filtered.sort((a, b) => b.likes - a.likes);
      default: // newest
        return filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    }
  }, [blogPosts, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative text-white py-20" style={{
        background: 'linear-gradient(135deg, #002F5E 0%, #004494 50%, #1677FF 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Kiến Thức & Blog DNA
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Khám phá kiến thức chuyên sâu về xét nghiệm DNA, quy trình pháp lý và chia sẻ kinh nghiệm
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                type={selectedCategory === category ? "primary" : "default"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full transition-all duration-200 hover:scale-105"
              >
                {category === "all" ? "Tất cả" : category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                type={viewMode === "grid" ? "primary" : "default"}
                onClick={() => setViewMode("grid")}
                className="rounded-none transition-all duration-200"
              >
                Lưới
              </Button>
              <Button
                type={viewMode === "list" ? "primary" : "default"}
                onClick={() => setViewMode("list")}
                className="rounded-none transition-all duration-200"
              >
                Danh sách
              </Button>
            </div>

            {/* Sort */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="popular">Phổ biến</option>
              <option value="liked">Nhiều like</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className={`blog-card hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                viewMode === "list" ? "flex-row" : ""
              }`}
              onClick={() => openPostDetail(post)}
            >
              {/* Category and Views */}
              <div className="flex justify-between items-center mb-4">
                <Tag color="blue">{post.category}</Tag>
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  <EyeOutlined /> {post.views}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center mb-3">
                <Avatar 
                  icon={<UserOutlined />}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">{post.author}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <CalendarOutlined />
                    {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                    <span>•</span>
                    {post.readTime}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-col ${viewMode === "list" ? "flex-1" : "h-64"}`}>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 flex-1 line-clamp-3">{post.summary}</p>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      type="text"
                      icon={likedPosts.has(post.id) ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikePost(post.id);
                      }}
                      className="flex items-center gap-1 transition-all duration-200 hover:scale-110"
                    >
                      {post.likes}
                    </Button>
                    
                    <Button
                      type="text"
                      icon={<CommentOutlined />}
                      className="flex items-center gap-1 transition-all duration-200 hover:scale-110"
                    >
                      {post.comments.length}
                    </Button>
                    
                    <Button
                      type="text"
                      icon={<ShareAltOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(window.location.href);
                        message.success("Đã sao chép link bài viết!");
                      }}
                      className="transition-all duration-200 hover:scale-110"
                    />
                  </div>
                  
                  <Button type="primary" size="small" className="transition-all duration-200 hover:scale-105">
                    Đọc thêm
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Post Detail Modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        className="blog-detail-modal"
      >
        {selectedPost && (
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Post Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Tag color="blue">{selectedPost.category}</Tag>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span><EyeOutlined /> {selectedPost.views}</span>
                  <span><CalendarOutlined /> {new Date(selectedPost.publishDate).toLocaleDateString('vi-VN')}</span>
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
              
              <div className="flex items-center mb-6">
                <Avatar 
                  icon={<UserOutlined />}
                  size={48}
                  className="mr-4"
                />
                <div>
                  <div className="font-medium text-lg">{selectedPost.author}</div>
                  <div className="text-gray-500">Tác giả</div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose max-w-none mb-8">
              <p className="text-lg leading-relaxed">{selectedPost.content}</p>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b">
              <Button
                type={likedPosts.has(selectedPost.id) ? "primary" : "default"}
                icon={likedPosts.has(selectedPost.id) ? <HeartFilled /> : <HeartOutlined />}
                onClick={() => handleLikePost(selectedPost.id)}
                className="flex items-center gap-2"
              >
                {likedPosts.has(selectedPost.id) ? "Đã thích" : "Thích"} ({selectedPost.likes})
              </Button>
              
              <Button
                icon={<ShareAltOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  message.success("Đã sao chép link bài viết!");
                }}
              >
                Chia sẻ
              </Button>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                Bình luận ({selectedPost.comments.length})
              </h3>

              {/* Add Comment */}
              {isCustomer ? (
                <div className="mb-6">
                  <div className="flex gap-3">
                    <Avatar 
                      icon={<UserOutlined />}
                    />
                    <div className="flex-1">
                      <TextArea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        rows={3}
                        className="mb-2"
                      />
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Gửi bình luận
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <Text type="secondary">
                    {isGuest 
                      ? "Vui lòng đăng nhập để bình luận" 
                      : "Chỉ khách hàng mới có thể bình luận"}
                  </Text>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    <Avatar 
                      icon={<UserOutlined />}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="mb-2">{comment.content}</p>
                      <Button
                        type="text"
                        size="small"
                        icon={likedComments.has(`${selectedPost.id}-${comment.id}`) ? 
                          <HeartFilled className="text-red-500" /> : 
                          <HeartOutlined />
                        }
                        onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                        className="flex items-center gap-1"
                      >
                        {comment.likes}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Blog;