import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_aws_deepdive_presentation():
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette - Professional AWS Cloud & Quick Commerce Theme
    BG_DARK = RGBColor(11, 15, 25)         # #0B0F19 (Deep Navy)
    CARD_BG = RGBColor(19, 27, 46)         # #131B2E (Card Surface)
    AWS_ORANGE = RGBColor(255, 153, 0)     # #FF9900 (Official AWS Orange)
    ACCENT_YELLOW = RGBColor(248, 203, 70) # #F8CB46 (Blinkit Yellow)
    ACCENT_GREEN = RGBColor(12, 131, 31)   # #0C831F (Blinkit Green)
    ACCENT_BLUE = RGBColor(56, 189, 248)   # #38BDF8 (Cloud Sky Blue)
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8 (Slate Gray)
    BORDER_COLOR = RGBColor(30, 41, 59)

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_card(slide, left, top, width, height, fill_color=CARD_BG, border_color=BORDER_COLOR):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = fill_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    def add_slide_header(slide, step_number, title_text, subtitle_text):
        step_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        p0 = step_box.text_frame.paragraphs[0]
        p0.text = f"{step_number} • AWS CLOUD SERVICES & ARCHITECTURE INTEGRATION"
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = AWS_ORANGE

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.7))
        p1 = title_box.text_frame.paragraphs[0]
        p1.text = title_text
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE

        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.45))
        p2 = sub_box.text_frame.paragraphs[0]
        p2.text = subtitle_text
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 1: Title Slide (Hero)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    hero_card = add_card(s1, Inches(0.8), Inches(1.0), Inches(11.733), Inches(5.5), fill_color=CARD_BG, border_color=BORDER_COLOR)

    # AWS Badge
    badge_card = add_card(s1, Inches(1.2), Inches(1.3), Inches(4.8), Inches(0.42), fill_color=RGBColor(24, 34, 58), border_color=AWS_ORANGE)
    badge_tf = badge_card.text_frame
    badge_tf.paragraphs[0].text = "☁️ AWS SERVICES & FULL-STACK INTEGRATION"
    badge_tf.paragraphs[0].font.size = Pt(9.5)
    badge_tf.paragraphs[0].font.bold = True
    badge_tf.paragraphs[0].font.color.rgb = AWS_ORANGE

    # Title
    title_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.85), Inches(10.9), Inches(1.7))
    p = title_box.text_frame.paragraphs[0]
    p.text = "MinutDel: How AWS Cloud Services Power\na 10-Minute Quick Commerce Platform"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Subtitle
    sub_box = s1.shapes.add_textbox(Inches(1.2), Inches(3.6), Inches(10.9), Inches(0.8))
    p_sub = sub_box.text_frame.paragraphs[0]
    p_sub.text = "A technical architectural breakdown of how Amazon EC2, Amazon SES, Amazon S3, Amazon RDS,\nAWS IAM, and Amazon CloudWatch interact seamlessly to deliver sub-second order fulfillment."
    p_sub.font.size = Pt(13)
    p_sub.font.color.rgb = TEXT_MUTED

    # 5 Key Service Pills
    service_pills = [
        ("COMPUTE", "Amazon EC2", "Spring Boot + Tomcat Host"),
        ("MESSAGING", "Amazon SES", "Async Tax Invoicing"),
        ("STORAGE", "Amazon S3", "Decoupled Media Assets"),
        ("DATABASE", "Amazon RDS", "PostgreSQL Persistence"),
        ("SECURITY", "AWS IAM & SG", "Least-Privilege Roles")
    ]
    for i, (cat, name, role) in enumerate(service_pills):
        col_x = Inches(1.2 + i * 2.18)
        c_stat = add_card(s1, col_x, Inches(4.55), Inches(2.05), Inches(1.2), fill_color=RGBColor(15, 23, 42))
        tf = c_stat.text_frame
        p_c = tf.paragraphs[0]
        p_c.text = cat
        p_c.font.size = Pt(8.5)
        p_c.font.bold = True
        p_c.font.color.rgb = AWS_ORANGE
        p_n = tf.add_paragraph()
        p_n.text = name
        p_n.font.size = Pt(11)
        p_n.font.bold = True
        p_n.font.color.rgb = TEXT_WHITE
        p_r = tf.add_paragraph()
        p_r.text = role
        p_r.font.size = Pt(8.5)
        p_r.font.color.rgb = TEXT_MUTED

    # Author info
    meta_box = s1.shapes.add_textbox(Inches(1.2), Inches(5.95), Inches(10.9), Inches(0.4))
    p_meta = meta_box.text_frame.paragraphs[0]
    p_meta.text = "Author: Arnav Astu   •   Project: MinutDel   •   Live GitHub: github.com/ArnavAstu/MinutDel"
    p_meta.font.size = Pt(10.5)
    p_meta.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 2: Architectural Overview & Decoupling
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_slide_header(s2, "01", "Why Quick Commerce Demands AWS Cloud Services", "Traditional on-premise servers fail under flash demand spikes; cloud decoupling solves the bottleneck.")

    challenges = [
        ("🔥 The Quick Commerce Problem",
         "• Extreme Traffic Spikes: Breakfast and dinner hours bring 20x traffic surges.\n• Fatal Over-Selling: Finite dark store stock requires instant ACID database locking.\n• Server Thread Exhaustion: Delivering heavy grocery media directly from application servers crashes CPU.\n• Checkout Latency: Synchronous SMTP email sending blocks customer checkout buttons.",
         ACCENT_YELLOW),
        ("☁️ How AWS Solves It",
         "• Elastic Compute (EC2): Stateless application container scales horizontally without losing state.\n• Transactional Email (SES): Asynchronously dispatches verified invoices without blocking checkout.\n• Object Storage (S3): Media served directly from AWS buckets, offloading 100% of image bandwidth from EC2.\n• Managed Database (RDS): Dedicated transaction isolation and multi-AZ durability for inventory.",
         ACCENT_GREEN),
        ("🎯 Zero-Cost Free Tier Fit",
         "• 100% Free Tier Compliant: Engineered specifically to run 24/7 without incurring cloud charges.\n• EC2: 750 free hours/month (t2.micro).\n• S3: 5 GB storage + 20,000 GET requests free.\n• RDS: 750 free hours/month (db.t3.micro).\n• SES: 62,000 free outbound emails/month when triggered from an EC2 instance.",
         ACCENT_BLUE)
    ]

    for i, (title, desc, accent) in enumerate(challenges):
        card = add_card(s2, Inches(0.8 + i * 4.0), Inches(2.0), Inches(3.7), Inches(5.0))
        tf = card.text_frame
        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(14)
        p_title.font.bold = True
        p_title.font.color.rgb = accent

        p_desc = tf.add_paragraph()
        p_desc.text = f"\n{desc}"
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 3: Complete AWS Service Topology Map
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_slide_header(s3, "02", "Complete MinutDel AWS Service Map", "How frontend requests traverse AWS network boundaries, compute, messaging, and storage tiers.")

    layers = [
        ("1. EDGE & NETWORK", "AWS VPC & Security Groups", "• Port 22 (SSH Administration): Restricted inbound access\n• Port 80 (HTTP): Public ingress gateway\n• Port 8080 (Custom TCP): MinutDel Spring Boot REST API & embedded React UI\n• NAT & Internet Gateway for outbound AWS API communication", AWS_ORANGE),
        ("2. COMPUTE ENGINE", "Amazon EC2 (t2.micro / Ubuntu 24.04)", "• Embedded Apache Tomcat web server\n• Single-Artifact deployment: Vite React SPA compiled into Spring Boot\n• @Async Thread Pool: Non-blocking 10-minute delivery lifecycle simulator\n• Mock Payment Gateway processor (UPI, Card, NetBanking)", ACCENT_YELLOW),
        ("3. TRANSACTIONAL MESSAGING", "Amazon SES (Simple Email Service)", "• Asynchronous order confirmation event trigger\n• AWS SDK v2 SesClient with DKIM/SPF verification\n• Generates responsive HTML tax invoice bills\n• Reports delivery status to customer inboxes with 62k free emails/mo", ACCENT_GREEN),
        ("4. PERSISTENCE & STORAGE", "Amazon S3 + Amazon RDS", "• Amazon S3: Object storage bucket for product catalog imagery\n• Amazon RDS PostgreSQL: Transactional ACID inventory locking\n• Dual-Profile Agility: Seamless switch between local H2 and AWS RDS", ACCENT_BLUE)
    ]

    for i, (badge, title, desc, col) in enumerate(layers):
        y = Inches(1.95 + i * 1.25)
        card = add_card(s3, Inches(0.8), y, Inches(11.733), Inches(1.12))
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = f"{badge}  •  {title}"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 4: Deep Dive - Amazon EC2
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_slide_header(s4, "03", "Service Deep Dive: Amazon EC2 (Elastic Compute Cloud)", "The compute backbone hosting the application container, async workers, and embedded web server.")

    card_ec2_l = add_card(s4, Inches(0.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_el = card_ec2_l.text_frame
    p_el1 = tf_el.paragraphs[0]
    p_el1.text = "🖥️ EC2 ROLE IN MINUTDEL ARCHITECTURE"
    p_el1.font.size = Pt(13)
    p_el1.font.bold = True
    p_el1.font.color.rgb = AWS_ORANGE
    p_el2 = tf_el.add_paragraph()
    p_el2.text = "\n• Single-Artifact Unified Deployment\n  Instead of managing separate Nginx, Node.js, and Java servers, the React 18 production build is bundled into Spring Boot's static resources. One 'java -jar' command boots the entire platform.\n\n• Embedded Apache Tomcat Web Server\n  Listens natively on port 8080, handling incoming customer REST calls, category browsing, and cart operations.\n\n• Asynchronous Event Thread Pool\n  EC2 handles background threads (@Async) executing the 5-stage dark store fulfillment state machine without blocking HTTP requests."
    p_el2.font.size = Pt(11)
    p_el2.font.color.rgb = TEXT_MUTED

    card_ec2_r = add_card(s4, Inches(6.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_er = card_ec2_r.text_frame
    p_er1 = tf_er.paragraphs[0]
    p_er1.text = "⚙️ EC2 CONFIGURATION & FREE TIER SPECS"
    p_er1.font.size = Pt(13)
    p_er1.font.bold = True
    p_er1.font.color.rgb = ACCENT_GREEN
    p_er2 = tf_er.add_paragraph()
    p_er2.text = "\n• Instance Flavor: t2.micro (1 vCPU, 1 GB Memory)\n  Provides 750 free hours per month — enough to run 24/7 all year without billing.\n\n• Operating System: Ubuntu 24.04 LTS (HVM)\n  Hardened Linux environment with OpenJDK 21 and systemd management.\n\n• Process Daemonization: nohup & Background Tasks\n  Executes: 'nohup java -jar target/*.jar > app.log 2>&1 &', allowing the server to persist indefinitely after SSH logout.\n\n• Port Forwarding Rule (Optional):\n  'iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080' forwards standard web traffic to Spring Boot seamlessly."
    p_er2.font.size = Pt(11)
    p_er2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 5: Deep Dive - Amazon SES (Simple Email Service)
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_slide_header(s5, "04", "Service Deep Dive: Amazon SES (Email Invoicing)", "Automated, non-blocking delivery of itemized tax invoice bills directly to customer inboxes.")

    ses_cards = [
        ("⚡ Asynchronous Dispatch (@Async)",
         "• Zero Checkout Latency: Traditional email sending freezes the checkout button for 2-4 seconds during SMTP handshakes.\n• Non-blocking Worker: In MinutDel, AwsEmailService is annotated with @Async, firing on a background worker thread.\n• The customer receives instant checkout confirmation in under 50ms, while SES dispatches the email in the background.",
         ACCENT_YELLOW),
        ("🧾 Blinkit-Styled HTML Tax Invoice",
         "• High-Aesthetic Responsive Template: Generates responsive HTML bills formatted for mobile and desktop mail clients.\n• Complete Order Metadata: Includes Order ID, Dark Store Hub (#07), Date/Time, and Customer Details (Name, Phone, Address).\n• Itemized Table: Product names, unit sizes, quantities, prices, subtotal, handling fee, and 10-minute promo discounts.\n• Payment Badge: Renders green 'ONLINE PAID' with Txn ID or amber 'CASH ON DELIVERY (PENDING)'.",
         ACCENT_GREEN),
        ("🛡️ AWS SES Free Tier & Sandbox",
         "• 62,000 Free Emails / Month: AWS provides 62,000 outbound emails free every month when sent from an EC2 instance.\n• Sandbox Protection: Prevents accidental spam by requiring sender and receiver verification in AWS SES Console.\n• AWS SDK v2 Client: Uses software.amazon.awssdk:ses:2.25.31 for reliable tokenized API requests.\n• Fallback Simulation Mode: Caches invoice in memory with local web viewer at /api/orders/{id}/invoice if offline.",
         ACCENT_BLUE)
    ]

    for i, (title, desc, accent) in enumerate(ses_cards):
        card = add_card(s5, Inches(0.8 + i * 4.0), Inches(2.0), Inches(3.7), Inches(5.0))
        tf = card.text_frame
        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = accent
        p_d = tf.add_paragraph()
        p_d.text = f"\n{desc}"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 6: Deep Dive - Amazon S3 (Simple Storage Service)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_slide_header(s6, "05", "Service Deep Dive: Amazon S3 (Decoupled Media Storage)", "Offloading static product assets to cloud object storage eliminates compute bottlenecks.")

    card_s3_l = add_card(s6, Inches(0.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_s3l = card_s3_l.text_frame
    p_s3l1 = tf_s3l.paragraphs[0]
    p_s3l1.text = "📦 THE STATELESS SERVER PRINCIPLE"
    p_s3l1.font.size = Pt(13)
    p_s3l1.font.bold = True
    p_s3l1.font.color.rgb = AWS_ORANGE
    p_s3l2 = tf_s3l.add_paragraph()
    p_s3l2.text = "\n• Why Local File Storage Breaks Quick Commerce:\n  Storing high-res grocery photos on EC2 hard drives (EBS) makes the server 'stateful'. When traffic surges, you cannot easily spin up additional instances without synchronizing files across servers.\n\n• Decoupled Object Storage (Amazon S3):\n  All catalog images (milk cartons, fresh produce, snacks) reside in an Amazon S3 bucket ('minutdel-product-assets').\n\n• Zero Compute Overhead:\n  Images are streamed directly from S3 to customer web browsers. The EC2 instance CPU never touches image pixels, leaving 100% of compute capacity free for transactions."
    p_s3l2.font.size = Pt(11)
    p_s3l2.font.color.rgb = TEXT_MUTED

    card_s3_r = add_card(s6, Inches(6.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_s3r = card_s3_r.text_frame
    p_s3r1 = tf_s3r.paragraphs[0]
    p_s3r1.text = "⚡ AWS SDK v2 INTEGRATION & RESILIENCE"
    p_s3r1.font.size = Pt(13)
    p_s3r1.font.bold = True
    p_s3r1.font.color.rgb = ACCENT_GREEN
    p_s3r2 = tf_s3r.add_paragraph()
    p_s3r2.text = "\n• AWS SDK v2 Client Implementation (AwsS3Service.java):\n  Initializes an S3Client using Region.AP_SOUTH_1. Automatically detects bucket presence via s3Client.headBucket().\n\n• Graceful Resilience Pattern:\n  If cloud credentials are absent or S3 is unreachable, the service automatically falls back to curated high-resolution CDNs without crashing the application.\n\n• AWS Free Tier Limits:\n  5 GB of standard object storage and 20,000 GET requests/month — more than enough for thousands of grocery browsing sessions."
    p_s3r2.font.size = Pt(11)
    p_s3r2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 7: Deep Dive - Amazon RDS & Database Agility
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_slide_header(s7, "06", "Service Deep Dive: Amazon RDS (Managed Relational Database)", "Transactional ACID guarantees for real-time inventory locking with dual-profile agility.")

    card_rds_l = add_card(s7, Inches(0.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_rl = card_rds_l.text_frame
    p_rl1 = tf_rl.paragraphs[0]
    p_rl1.text = "🗄️ INVENTORY INTEGRITY & CONCURRENCY"
    p_rl1.font.size = Pt(13)
    p_rl1.font.bold = True
    p_rl1.font.color.rgb = ACCENT_BLUE
    p_rl2 = tf_rl.add_paragraph()
    p_rl2.text = "\n• Real-Time Stock Subtraction (@Transactional):\n  Quick Commerce dark stores carry limited units (e.g., 20 packets of milk). When a customer checks out, the database immediately checks 'stockQuantity >= orderedQuantity' and decrements the inventory atomically.\n\n• Preventing Double-Selling:\n  ACID transactions ensure that two customers cannot purchase the last item simultaneously.\n\n• Managed Maintenance & Backups:\n  Amazon RDS handles automated point-in-time recovery, OS patching, and hardware failover without engineering overhead."
    p_rl2.font.size = Pt(11)
    p_rl2.font.color.rgb = TEXT_MUTED

    card_rds_r = add_card(s7, Inches(6.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_rr = card_rds_r.text_frame
    p_rr1 = tf_rr.paragraphs[0]
    p_rr1.text = "🔄 DUAL-PROFILE ZERO-LOCK-IN ARCHITECTURE"
    p_rr1.font.size = Pt(13)
    p_rr1.font.bold = True
    p_rr1.font.color.rgb = ACCENT_YELLOW
    p_rr2 = tf_rr.add_paragraph()
    p_rr2.text = "\n• Local Profile (spring.profiles.active=local):\n  Boots embedded in-memory H2 database. Developers can clone and run with zero PostgreSQL installation, testing with H2 Web Console (/h2-console).\n\n• Production Profile (spring.profiles.active=aws):\n  Seamlessly connects to Amazon RDS PostgreSQL using environment variables: RDS_JDBC_URL, RDS_USERNAME, RDS_PASSWORD.\n\n• Hibernate JPA Abstraction:\n  Zero SQL queries need rewriting — Hibernate generates the correct dialect for both H2 and PostgreSQL automatically."
    p_rr2.font.size = Pt(11)
    p_rr2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 8: Deep Dive - AWS IAM & Security Groups
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_slide_header(s8, "07", "Security & Governance: AWS IAM Roles & Security Groups", "Eliminating hardcoded secrets using instance roles and least-privilege virtual firewalls.")

    card_sec_l = add_card(s8, Inches(0.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_sl = card_sec_l.text_frame
    p_sl1 = tf_sl.paragraphs[0]
    p_sl1.text = "🔑 AWS IAM ROLES (ZERO HARDCODED KEYS)"
    p_sl1.font.size = Pt(13)
    p_sl1.font.bold = True
    p_sl1.font.color.rgb = AWS_ORANGE
    p_sl2 = tf_sl.add_paragraph()
    p_sl2.text = "\n• The Anti-Pattern (Hardcoded Secrets):\n  Inexperienced developers put AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY directly in code or git repos, leading to compromised AWS accounts.\n\n• The Production Pattern (IAM Instance Profile):\n  We attach an IAM Role ('MinutDel-EC2-SES-Role') with 'AmazonSESFullAccess' directly to the EC2 instance.\n\n• Automatic Credential Rotation:\n  The AWS SDK automatically fetches temporary security tokens from the EC2 Instance Metadata Service (IMDSv2) at 169.254.169.254. No keys exist on disk!"
    p_sl2.font.size = Pt(11)
    p_sl2.font.color.rgb = TEXT_MUTED

    card_sec_r = add_card(s8, Inches(6.8), Inches(2.0), Inches(5.7), Inches(5.0))
    tf_sr = card_sec_r.text_frame
    p_sr1 = tf_sr.paragraphs[0]
    p_sr1.text = "🛡️ SECURITY GROUPS (VIRTUAL FIREWALL)"
    p_sr1.font.size = Pt(13)
    p_sr1.font.bold = True
    p_sr1.font.color.rgb = ACCENT_GREEN
    p_sr2 = tf_sr.add_paragraph()
    p_sr2.text = "\n• Inbound Rule 1: Port 22 (SSH)\n  Restricted administration access for remote server configuration.\n\n• Inbound Rule 2: Port 80 (HTTP)\n  Standard internet web traffic gateway.\n\n• Inbound Rule 3: Port 8080 (Custom TCP)\n  Dedicated listener for MinutDel Spring Boot REST API and embedded React UI.\n\n• Outbound Rules: Default All (0.0.0.0/0)\n  Allows the EC2 instance to query AWS SES API, Amazon S3, and download Ubuntu package updates securely."
    p_sr2.font.size = Pt(11)
    p_sr2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 9: Deep Dive - Observability & Telemetry
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_slide_header(s9, "08", "Telemetry & Observability: Actuator & CloudWatch", "Proving live cloud connectivity through real-time telemetry endpoints and structured logging.")

    obs_cards = [
        ("📡 Dynamic Cloud Telemetry",
         "• Live API Endpoint (/api/cloud-info): Dynamically discovers and surfaces whether the server is running on local hardware or AWS EC2.\n• Cloud Provider & Region: Inspects EC2 metadata to display active region (e.g. ap-south-1).\n• S3 Bucket Connectivity: Reports whether cloud image storage is connected or simulating.\n• SES Sender & Region: Exposes active sender email and dispatch engine status.",
         ACCENT_YELLOW),
        ("📊 CloudWatch System Metrics",
         "• CPU Utilization Alarms: Monitors t2.micro CPU credit balance and usage percentage.\n• Network In/Out Bytes: Tracks bandwidth consumed by API transactions and customer traffic.\n• Disk I/O Operations: Observes EBS volume read/write latency to ensure database performance.\n• 5 GB Free Log Ingestion: Centralizes system logs under AWS Free Tier allowance.",
         ACCENT_GREEN),
        ("🔍 In-App Cloud Inspector Modal",
         "• One-Click UI Inspector: A dedicated 'Cloud Status' modal in the navigation bar lets evaluators inspect infrastructure.\n• Live Dialect Status: Proves active database engine (H2 vs RDS PostgreSQL).\n• Instance Hostname Display: Renders the active AWS EC2 internal and public IP hostname live.\n• Validates Free Tier Compliance: Real-time proof of zero-cost architecture during demos.",
         ACCENT_BLUE)
    ]

    for i, (title, desc, accent) in enumerate(obs_cards):
        card = add_card(s9, Inches(0.8 + i * 4.0), Inches(2.0), Inches(3.7), Inches(5.0))
        tf = card.text_frame
        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = accent
        p_d = tf.add_paragraph()
        p_d.text = f"\n{desc}"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 10: The Seamless End-to-End User Flow
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_slide_header(s10, "09", "The Seamless Lifecycle: How AWS Services Collaborate", "Tracing an order from shopping cart to doorstep delivery across all integrated AWS services.")

    flow_steps = [
        ("1. BROWSE & CART", "Customer adds groceries. Images streamed directly from Amazon S3. No EC2 image bottlenecks.", AWS_ORANGE),
        ("2. PAYMENT SELECTION", "Customer enters Name, Address, Phone, Email. Chooses Cash on Delivery (COD) or Mock Online Gateway.", ACCENT_YELLOW),
        ("3. MOCKPAY / COD AUTH", "MockPay verifies UPI / Card with 3-step authorization spinner, generating unique transaction ref ID.", ACCENT_GREEN),
        ("4. ATOMIC STOCK LOCK", "Spring Boot receives order; Amazon RDS executes atomic inventory decrement in database.", ACCENT_BLUE),
        ("5. ASYNC SES DISPATCH", "AwsEmailService generates HTML tax invoice and dispatches to customer inbox via Amazon SES.", AWS_ORANGE),
        ("6. 10-MIN FULFILLMENT", "Async simulator triggers: PLACED -> PACKING -> RIDER_ASSIGNED -> OUT_FOR_DELIVERY -> DELIVERED.", ACCENT_GREEN)
    ]

    for i, (step_title, step_desc, col) in enumerate(flow_steps):
        row = i // 2
        col_idx = i % 2
        x = Inches(0.8 + col_idx * 5.95)
        y = Inches(2.0 + row * 1.65)
        card = add_card(s10, x, y, Inches(5.75), Inches(1.45))
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = step_title
        p.font.size = Pt(12.5)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = f"\n{step_desc}"
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 11: 100% Free Tier Compliance Matrix
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_slide_header(s11, "10", "AWS Free Tier Service Mapping & Cost Elimination", "Guaranteed zero financial liability through strict architectural constraint adherence.")

    matrix_rows = [
        ("Amazon EC2 (Compute)", "t2.micro / t3.micro", "750 Hours / Month (100% Free)", "MinutDel single-instance runs 24/7 without exceeding allowance (744 hrs in a 31-day month).", ACCENT_YELLOW),
        ("Amazon SES (Messaging)", "Outbound Emails", "62,000 Emails / Month Free", "Free tier applies when emails are sent from an Amazon EC2 instance. Covers ~2,000 orders/day.", ACCENT_GREEN),
        ("Amazon S3 (Storage)", "Standard Storage", "5 GB Storage + 20,000 GETs", "Grocery imagery catalog consumes < 50 MB, leaving 99% of free quota unused.", ACCENT_BLUE),
        ("Amazon RDS (Database)", "db.t3.micro PostgreSQL", "750 Hours / Month + 20 GB", "Covers primary relational database with multi-AZ snapshot capabilities at zero cost.", ACCENT_YELLOW),
        ("Amazon CloudWatch", "Basic Metrics & Logs", "5 GB Log Ingestion + 3 Alarms", "Sufficient for application health monitoring, CPU credit tracking, and Tomcat error logging.", ACCENT_GREEN)
    ]

    for i, (svc, spec, allowance, impact, col) in enumerate(matrix_rows):
        y = Inches(1.95 + i * 1.0)
        card = add_card(s11, Inches(0.8), y, Inches(11.733), Inches(0.88))
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = f"{svc}  •  {spec}"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = f"AWS Free Tier Quota: {allowance}   |   Architecture Fit: {impact}"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 12: Defense & Viva Guide
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_slide_header(s12, "11", "Viva Defense & Evaluator Q&A Cheat Sheet", "Authoritative, industry-standard answers to critical cloud computing defense questions.")

    viva_qa = [
        ("Q: Why did you use Amazon SES instead of standard SMTP in JavaMail?",
         "A: Standard JavaMail SMTP blocks thread execution during DNS resolution and handshake, slowing checkout to 3+ seconds. Amazon SES provides an asynchronous, tokenized REST client with 62,000 free emails/mo from EC2 and built-in DKIM/SPF deliverability.",
         AWS_ORANGE),
        ("Q: Why is S3 preferred over local EC2 disk storage for grocery images?",
         "A: Storing media on EC2 EBS block storage makes the instance 'stateful', preventing auto-scaling and wasting expensive compute disk. Amazon S3 decouples media storage with 99.999999999% durability and serves assets directly to client browsers.",
         ACCENT_GREEN),
        ("Q: How does MinutDel handle AWS credentials securely on EC2?",
         "A: We use IAM Instance Profiles ('MinutDel-EC2-SES-Role'). The AWS SDK fetches temporary rotating security tokens via IMDSv2. Zero access keys or secret keys are stored in source code or server disk.",
         ACCENT_BLUE),
        ("Q: What is the benefit of your Single-Artifact architecture?",
         "A: We embed the compiled Vite React 18 production bundle inside Spring Boot's static resources. A single 'java -jar' command serves both the REST API and the frontend on port 8080, eliminating separate Node/Nginx setup on EC2.",
         ACCENT_YELLOW)
    ]

    for i, (q, a, col) in enumerate(viva_qa):
        y = Inches(1.95 + i * 1.25)
        card = add_card(s12, Inches(0.8), y, Inches(11.733), Inches(1.15))
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = q
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = a
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED

    output_path = os.path.abspath(r"e:\Cloud project\Ecom\presentation\MinutDel_AWS_Services_Architecture.pptx")
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_aws_deepdive_presentation()
