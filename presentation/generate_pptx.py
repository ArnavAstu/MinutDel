import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette
    BG_DARK = RGBColor(11, 15, 25)       # #0B0F19
    CARD_BG = RGBColor(19, 27, 46)       # #131B2E
    ACCENT_YELLOW = RGBColor(248, 203, 70) # #F8CB46 (Blinkit Yellow)
    ACCENT_GREEN = RGBColor(12, 131, 31)   # #0C831F (Blinkit Green)
    ACCENT_BLUE = RGBColor(56, 189, 248)   # #38BDF8
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8
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
        # Step tag
        step_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        p0 = step_box.text_frame.paragraphs[0]
        p0.text = f"{step_number} • CLOUD COMPUTING SYSTEM ARCHITECTURE"
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = ACCENT_YELLOW

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        p1 = title_box.text_frame.paragraphs[0]
        p1.text = title_text
        p1.font.size = Pt(26)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(11.7), Inches(0.5))
        p2 = sub_box.text_frame.paragraphs[0]
        p2.text = subtitle_text
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Glow Card Header
    add_card(s1, Inches(0.8), Inches(1.2), Inches(11.733), Inches(5.1), fill_color=CARD_BG, border_color=BORDER_COLOR)

    # Badge
    badge_card = add_card(s1, Inches(1.2), Inches(1.6), Inches(4.2), Inches(0.45), fill_color=RGBColor(24, 34, 58), border_color=ACCENT_YELLOW)
    badge_tf = badge_card.text_frame
    badge_tf.paragraphs[0].text = "⚡ AWS FREE TIER CLOUD COMPUTING PROJECT"
    badge_tf.paragraphs[0].font.size = Pt(10)
    badge_tf.paragraphs[0].font.bold = True
    badge_tf.paragraphs[0].font.color.rgb = ACCENT_YELLOW

    # Main Hero Title
    title_box = s1.shapes.add_textbox(Inches(1.2), Inches(2.2), Inches(10.9), Inches(1.8))
    p = title_box.text_frame.paragraphs[0]
    p.text = "MinutDel: Scalable 10-Minute\nQuick Commerce Cloud Platform"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    # Hero Subtitle
    sub_box = s1.shapes.add_textbox(Inches(1.2), Inches(4.1), Inches(10.9), Inches(0.8))
    p_sub = sub_box.text_frame.paragraphs[0]
    p_sub.text = "Full-stack event-driven grocery fulfillment engine architected with Spring Boot 3, React 18,\nand deployed on zero-cost AWS Cloud infrastructure (EC2, S3, RDS, Actuator)."
    p_sub.font.size = Pt(14)
    p_sub.font.color.rgb = TEXT_MUTED

    # 4 Quick stats pills
    stats = [
        ("COMPUTE", "Amazon EC2 (t2.micro)"),
        ("STORAGE", "Amazon S3 Bucket"),
        ("DATABASE", "PostgreSQL / H2 JPA"),
        ("OBSERVABILITY", "CloudWatch / Actuator")
    ]
    for i, (label, val) in enumerate(stats):
        col_x = Inches(1.2 + i * 2.7)
        card_stat = add_card(s1, col_x, Inches(5.1), Inches(2.55), Inches(0.9), fill_color=RGBColor(15, 23, 42))
        tf = card_stat.text_frame
        p_lbl = tf.paragraphs[0]
        p_lbl.text = label
        p_lbl.font.size = Pt(9)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = ACCENT_YELLOW
        p_val = tf.add_paragraph()
        p_val.text = val
        p_val.font.size = Pt(11)
        p_val.font.bold = True
        p_val.font.color.rgb = TEXT_WHITE

    # Author
    meta_box = s1.shapes.add_textbox(Inches(0.8), Inches(6.5), Inches(11.7), Inches(0.5))
    p_meta = meta_box.text_frame.paragraphs[0]
    p_meta.text = "Author: Arnav Astu   •   Course: Cloud Computing   •   GitHub: github.com/ArnavAstu/MinutDel"
    p_meta.font.size = Pt(11)
    p_meta.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 2: Problem Statement & Motivation
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_slide_header(s2, "01", "Why Quick Commerce Demands Cloud Computing", "Evaluating how cloud-native elasticity solves traditional on-premise grocery bottlenecks.")

    pillars = [
        ("⚡ Flash Demand Spikes", 
         "Traffic surges 10x-50x during breakfast and evening snack hours.\n\nOn-premise physical servers either suffer costly fatal crashes during spikes or waste massive idle capital during off-peak hours.",
         ACCENT_YELLOW),
        ("⏱️ Sub-100ms Inventory Locking",
         "Dark stores hold finite local inventory.\n\nOver-selling leads to costly refund logistics. High-throughput ACID transactions and low-latency databases are required to guarantee inventory integrity.",
         ACCENT_GREEN),
        ("📦 Decoupled Media & Compute",
         "Serving high-resolution grocery imagery directly from the application server exhausts thread pools and saturates CPU.\n\nOffloading media to Cloud Object Storage (S3) frees compute resources entirely for transactions.",
         ACCENT_BLUE)
    ]

    for i, (title, desc, accent) in enumerate(pillars):
        card = add_card(s2, Inches(0.8 + i * 4.0), Inches(2.3), Inches(3.7), Inches(4.4))
        tf = card.text_frame
        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(16)
        p_title.font.bold = True
        p_title.font.color.rgb = accent

        p_desc = tf.add_paragraph()
        p_desc.text = f"\n{desc}"
        p_desc.font.size = Pt(12)
        p_desc.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 3: Architecture Blueprint
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_slide_header(s3, "02", "High-Level Cloud Architecture Blueprint", "Decoupled 3-Tier topology following 12-Factor Cloud Application methodology.")

    tiers = [
        ("TIER 1: PRESENTATION (EDGE)", "React 18 SPA (Vite + Tailwind)", "• Client-side reactive storefront\n• 5-stage live delivery progress polling\n• Embedded Cloud Telemetry inspector\n• Bundled directly into Spring Boot static resources", ACCENT_BLUE),
        ("TIER 2: COMPUTE (APPLICATION)", "Spring Boot 3 on AWS EC2", "• Stateless REST API on port 8080\n• Spring Data JPA abstraction layer\n• Asynchronous @Async simulation engine\n• Actuator health & telemetry endpoints", ACCENT_YELLOW),
        ("TIER 3: PERSISTENCE & OBJECTS", "Amazon RDS + Amazon S3", "• Amazon RDS PostgreSQL (Managed DB)\n• Embedded H2 for local zero-setup dev\n• Amazon S3 bucket for grocery imagery\n• AWS SDK v2 client integration with fallback", ACCENT_GREEN)
    ]

    for i, (tag, name, details, col) in enumerate(tiers):
        card = add_card(s3, Inches(0.8 + i * 4.0), Inches(2.3), Inches(3.7), Inches(4.5))
        tf = card.text_frame
        p_tag = tf.paragraphs[0]
        p_tag.text = tag
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = col

        p_name = tf.add_paragraph()
        p_name.text = name
        p_name.font.size = Pt(16)
        p_name.font.bold = True
        p_name.font.color.rgb = TEXT_WHITE

        p_det = tf.add_paragraph()
        p_det.text = f"\n{details}"
        p_det.font.size = Pt(12)
        p_det.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 4: AWS Free Tier Service Mapping
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_slide_header(s4, "03", "AWS Cloud Services & Free Tier Mapping", "100% Free Tier compliant architecture designed to eliminate accidental billing.")

    services = [
        ("Amazon EC2", "Virtual Compute", "750 Hours / Month (t2.micro / t3.micro)", "Hosts Spring Boot container, web server, and asynchronous execution threads 24/7.", ACCENT_YELLOW),
        ("Amazon S3", "Object Storage", "5 GB Standard Storage + 20,000 GETs", "Decoupled media hosting for grocery images, served directly to browsers without touching server CPU.", ACCENT_GREEN),
        ("Amazon RDS", "Managed Relational DB", "750 Hours / Month (db.t3.micro) + 20 GB", "Managed PostgreSQL database instance providing transaction guarantees and multi-AZ backups.", ACCENT_BLUE),
        ("Amazon CloudWatch", "Telemetry & Logs", "5 GB Ingestion + Basic Alarms", "Centralized aggregation of Spring Boot Actuator health metrics, API latency, and application logs.", ACCENT_YELLOW)
    ]

    for i, (srv, role, free_allowance, explanation, color) in enumerate(services):
        y = Inches(2.3 + i * 1.15)
        card = add_card(s4, Inches(0.8), y, Inches(11.733), Inches(1.0))
        tf = card.text_frame
        
        p = tf.paragraphs[0]
        p.text = f"{srv}  •  {role}"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = f"Free Tier Limit: {free_allowance}  |  Role: {explanation}"
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 5: 10-Minute Simulated Fulfillment State Machine
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_slide_header(s5, "04", "10-Minute Asynchronous Fulfillment State Machine", "Non-blocking event simulation modeling dark store picking, packing, and dispatch.")

    stages = [
        ("1. PLACED (T + 0s)", "Dark Store #07 confirms order. Inventory stock decremented in DB. Simulation thread spawned via @Async.", ACCENT_YELLOW),
        ("2. PACKING (T + 5s)", "Store picker Rajesh collects grocery items from micro-warehouse shelves. ETA countdown shifts to 8 mins.", ACCENT_GREEN),
        ("3. RIDER ASSIGNED (T + 11s)", "Delivery partner assigned (e.g., Amit Sharma • +91 98711-22334). Rider waits at dark store bay.", ACCENT_BLUE),
        ("4. OUT FOR DELIVERY (T + 17s)", "Order dispatched on electric two-wheeler. Real-time ETA updates to 3 mins remaining.", ACCENT_YELLOW),
        ("5. DELIVERED (T + 25s)", "Delivery completed! 10-minute guarantee met. Order marked finalized in database.", ACCENT_GREEN)
    ]

    for i, (title, desc, col) in enumerate(stages):
        y = Inches(2.3 + i * 0.95)
        card = add_card(s5, Inches(0.8), y, Inches(11.733), Inches(0.82))
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 6: Backend Engineering & Spring Boot
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_slide_header(s6, "05", "Spring Boot 3 & Dual-Profile Database Agility", "Zero-lock-in architecture: write once, test locally, deploy seamlessly to AWS.")

    # Left card: Local
    card_l = add_card(s6, Inches(0.8), Inches(2.3), Inches(5.7), Inches(4.5))
    tf_l = card_l.text_frame
    p_l1 = tf_l.paragraphs[0]
    p_l1.text = "LOCAL PROFILE (spring.profiles.active=local)"
    p_l1.font.size = Pt(13)
    p_l1.font.bold = True
    p_l1.font.color.rgb = ACCENT_YELLOW
    
    p_l2 = tf_l.add_paragraph()
    p_l2.text = "\n• Embedded In-Memory SQL (H2)\n  Spins up automatically in RAM. No local PostgreSQL or Docker install needed.\n\n• Automatic Seeding (DataLoader)\n  Automatically seeds 12 quick-commerce grocery items + 5 categories on startup.\n\n• Embedded H2 Web Console\n  Allows instant database table inspection at http://localhost:8080/h2-console."
    p_l2.font.size = Pt(11.5)
    p_l2.font.color.rgb = TEXT_MUTED

    # Right card: Cloud
    card_r = add_card(s6, Inches(6.8), Inches(2.3), Inches(5.7), Inches(4.5))
    tf_r = card_r.text_frame
    p_r1 = tf_r.paragraphs[0]
    p_r1.text = "PRODUCTION PROFILE (spring.profiles.active=aws)"
    p_r1.font.size = Pt(13)
    p_r1.font.bold = True
    p_r1.font.color.rgb = ACCENT_GREEN

    p_r2 = tf_r.add_paragraph()
    p_r2.text = "\n• Amazon RDS PostgreSQL Managed DB\n  Activated via application-aws.yml or environment variables without changing Java code.\n\n• Spring Data JPA Abstraction\n  Hibernate abstracts the SQL dialect: zero entity or query modifications required.\n\n• AWS SDK v2 S3 Client\n  Streams image URLs from S3 buckets with automatic fallback to local placeholders."
    p_r2.font.size = Pt(11.5)
    p_r2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 7: Frontend Experience & Real-Time Telemetry
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_slide_header(s7, "06", "React Storefront & Live Cloud Telemetry", "Modern Blinkit-style user interface integrated with live cloud inspection capabilities.")

    fe_cards = [
        ("🛒 Instant Cart Drawer", "• Persistent client-side cart state\n• Real-time +/- quantity steppers\n• Automatic bill calculation (MRP, handling fees, free 10-min delivery promo)\n• Customer delivery address input", ACCENT_YELLOW),
        ("🚴 Live Order Tracker", "• 5-stage animated progress bar\n• Automated background polling of /api/orders/{id} every 2.5 seconds\n• Live countdown timer (10 mins -> 0 mins)\n• Delivery partner name & contact badge", ACCENT_GREEN),
        ("☁️ Cloud Telemetry Modal", "• Live inspector querying /api/cloud-info\n• Displays active EC2 Hostname\n• Verifies active Database dialect\n• Displays Amazon S3 bucket connectivity\n• Proves AWS Free Tier compliance live", ACCENT_BLUE)
    ]

    for i, (title, desc, col) in enumerate(fe_cards):
        card = add_card(s7, Inches(0.8 + i * 4.0), Inches(2.3), Inches(3.7), Inches(4.5))
        tf = card.text_frame
        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(15)
        p_t.font.bold = True
        p_t.font.color.rgb = col
        p_d = tf.add_paragraph()
        p_d.text = f"\n{desc}"
        p_d.font.size = Pt(11.5)
        p_d.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 8: Cloud Security & 12-Factor Compliance
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_slide_header(s8, "07", "AWS Security, Networking & 12-Factor Principles", "Implementing enterprise cloud governance and least-privilege virtual network security.")

    card_sec = add_card(s8, Inches(0.8), Inches(2.3), Inches(5.7), Inches(4.5))
    tf_s = card_sec.text_frame
    p_s1 = tf_s.paragraphs[0]
    p_s1.text = "AWS VIRTUAL FIREWALL (SECURITY GROUPS)"
    p_s1.font.size = Pt(13)
    p_s1.font.bold = True
    p_s1.font.color.rgb = ACCENT_YELLOW
    p_s2 = tf_s.add_paragraph()
    p_s2.text = "\n• Port 22 (SSH Inbound)\n  Restricted administration access for EC2 terminal management.\n\n• Port 80 (HTTP Inbound)\n  Public entry point for internet web browser traffic.\n\n• Port 8080 (Custom TCP Inbound)\n  Dedicated listener for MinutDel Spring Boot REST API & embedded React application.\n\n• Outbound Traffic (Default All)\n  Allows instances to pull updates, Maven packages, and communicate with S3."
    p_s2.font.size = Pt(11.5)
    p_s2.font.color.rgb = TEXT_MUTED

    card_12f = add_card(s8, Inches(6.8), Inches(2.3), Inches(5.7), Inches(4.5))
    tf_f = card_12f.text_frame
    p_f1 = tf_f.paragraphs[0]
    p_f1.text = "12-FACTOR CLOUD APP METHODOLOGY"
    p_f1.font.size = Pt(13)
    p_f1.font.bold = True
    p_f1.font.color.rgb = ACCENT_GREEN
    p_f2 = tf_f.add_paragraph()
    p_f2.text = "\n• VI. Stateless Processes\n  EC2 servers store zero persistent session state. Database state lives externally in RDS.\n\n• III. Config in the Environment\n  Database credentials, ports, and bucket names injected via environment variables.\n\n• VII. Port Binding\n  Completely self-contained; exports HTTP on port 8080 via embedded Apache Tomcat.\n\n• IV. Backing Services\n  Treats S3 and RDS as attached network resources without code-level tight coupling."
    p_f2.font.size = Pt(11.5)
    p_f2.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 9: DevOps & Zero-Friction Cloud Deployment
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_slide_header(s9, "08", "Zero-Friction Cloud Deployment Workflow", "From developer workstation to 24/7 public cloud execution in 3 streamlined steps.")

    deploy_steps = [
        ("Step 1: Code & Version Control", "• Source code pushed to GitHub: github.com/ArnavAstu/MinutDel\n• Pre-compiled React frontend embedded into Spring Boot's static resources\n• Clean .gitignore eliminates node_modules and target/ bloat", ACCENT_YELLOW),
        ("Step 2: EC2 Cloud Provisioning", "• Launch Ubuntu 24.04 LTS instance on AWS EC2\n• Configure Security Group (Ports 22, 80, 8080)\n• Install OpenJDK 21, Git, and Maven via apt\n• Clone GitHub repository directly on EC2 instance", ACCENT_GREEN),
        ("Step 3: Build & Daemon Launch", "• Package unified uber-JAR: mvn clean package -DskipTests\n• Execute background daemon: nohup java -jar target/*.jar > app.log 2>&1 &\n• Immediately accessible globally at: http://<EC2-PUBLIC-IP>:8080", ACCENT_BLUE)
    ]

    for i, (title, desc, col) in enumerate(deploy_steps):
        card = add_card(s9, Inches(0.8 + i * 4.0), Inches(2.3), Inches(3.7), Inches(4.5))
        tf = card.text_frame
        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = col
        p_d = tf.add_paragraph()
        p_d.text = f"\n{desc}"
        p_d.font.size = Pt(11.5)
        p_d.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 10: Conclusion & Scalability Roadmap
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_slide_header(s10, "09", "Conclusion & Production Scalability Roadmap", "Project achievements and blueprint for enterprise-scale quick commerce expansion.")

    card_c1 = add_card(s10, Inches(0.8), Inches(2.3), Inches(5.7), Inches(3.5))
    tf_c1 = card_c1.text_frame
    p_c1_t = tf_c1.paragraphs[0]
    p_c1_t.text = "🏆 PROJECT ACHIEVEMENTS"
    p_c1_t.font.size = Pt(13)
    p_c1_t.font.bold = True
    p_c1_t.font.color.rgb = ACCENT_GREEN
    p_c1_d = tf_c1.add_paragraph()
    p_c1_d.text = "\n• Fully functional 10-minute Quick Commerce simulated platform\n• Asynchronous state machine mimicking dark-store fulfillment\n• Dual-profile database agility (H2 locally, RDS on AWS)\n• AWS SDK v2 Object Storage (S3) integration\n• 100% Free Tier compliant with zero operational costs"
    p_c1_d.font.size = Pt(11.5)
    p_c1_d.font.color.rgb = TEXT_MUTED

    card_c2 = add_card(s10, Inches(6.8), Inches(2.3), Inches(5.7), Inches(3.5))
    tf_c2 = card_c2.text_frame
    p_c2_t = tf_c2.paragraphs[0]
    p_c2_t.text = "🚀 FUTURE ENTERPRISE ROADMAP"
    p_c2_t.font.size = Pt(13)
    p_c2_t.font.bold = True
    p_c2_t.font.color.rgb = ACCENT_BLUE
    p_c2_d = tf_c2.add_paragraph()
    p_c2_d.text = "\n• Amazon SQS: Decouple order checkout queue for flash traffic smoothing\n• Amazon DynamoDB: Store high-frequency rider GPS telemetry coordinates\n• AWS ALB & Auto Scaling: Automatic EC2 scale-out during peak grocery hours\n• Amazon CloudFront CDN: Sub-10ms global edge caching for grocery assets"
    p_c2_d.font.size = Pt(11.5)
    p_c2_d.font.color.rgb = TEXT_MUTED

    # Bottom banner
    b_card = add_card(s10, Inches(0.8), Inches(6.0), Inches(11.733), Inches(0.95), fill_color=RGBColor(24, 34, 58), border_color=ACCENT_YELLOW)
    b_tf = b_card.text_frame
    p_bt = b_tf.paragraphs[0]
    p_bt.text = "Thank You!   •   Live Demonstration & Defense"
    p_bt.font.size = Pt(14)
    p_bt.font.bold = True
    p_bt.font.color.rgb = TEXT_WHITE
    p_bt.alignment = PP_ALIGN.CENTER

    p_bs = b_tf.add_paragraph()
    p_bs.text = "GitHub Repository: https://github.com/ArnavAstu/MinutDel"
    p_bs.font.size = Pt(11)
    p_bs.font.color.rgb = ACCENT_YELLOW
    p_bs.alignment = PP_ALIGN.CENTER

    output_path = os.path.abspath(r"e:\Cloud project\Ecom\presentation\MinutDel_Cloud_Architecture.pptx")
    prs.save(output_path)
    print(f"Presentation generated successfully at: {output_path}")

if __name__ == "__main__":
    create_presentation()
