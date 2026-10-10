package com.kart.initializer;

import com.kart.constants.RoleName;
import com.kart.entity.Category;
import com.kart.entity.Organization;
import com.kart.entity.OrganizationMember;
import com.kart.entity.Product;
import com.kart.entity.Role;
import com.kart.entity.User;
import com.kart.repository.CategoryRepository;
import com.kart.repository.OrganizationMemberRepository;
import com.kart.repository.OrganizationRepository;
import com.kart.repository.ProductRepository;
import com.kart.repository.RoleRepository;
import com.kart.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@org.springframework.context.annotation.Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed Roles
        Role merchantRole = roleRepository.findByName("MERCHANT")
                .orElseGet(() -> roleRepository.save(Role.builder().name("MERCHANT").build()));
        Role affiliateRole = roleRepository.findByName("AFFILIATE")
                .orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").build()));

        // Seed Merchant User
        User merchant = userRepository.findByEmail("merchant@linkkart.com").orElse(null);
        if (merchant == null) {
            merchant = User.builder()
                    .email("merchant@linkkart.com")
                    .password(passwordEncoder.encode("password123"))
                    .status("ACTIVE")
                    .role(merchantRole)
                    .createdAt(LocalDateTime.now())
                    .build();
            merchant = userRepository.save(merchant);
        }

        // Seed Organization for Merchant
        Organization organization = organizationRepository.findBySlug("linkkart-merchant-org").orElse(null);
        if (organization == null) {
            organization = Organization.builder()
                    .name("LinkKart Merchant Org")
                    .slug("linkkart-merchant-org")
                    .websiteUrl("https://merchant.linkkart.com")
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .build();
            organization = organizationRepository.save(organization);
            
            OrganizationMember member = OrganizationMember.builder()
                    .organization(organization)
                    .user(merchant)
                    .role("OWNER")
                    .createdAt(LocalDateTime.now())
                    .build();
            organizationMemberRepository.save(member);
        }

        // Seed Admin User
        User admin = userRepository.findByEmail("admin@linkkart.com").orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .email("admin@linkkart.com")
                    .password(passwordEncoder.encode("password123"))
                    .status("ACTIVE")
                    .role(adminRole)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
        }

        // Seed Demo Affiliate User
        User affiliate = userRepository.findByEmail("affiliate@linkkart.com").orElse(null);
        if (affiliate == null) {
            affiliate = User.builder()
                    .email("affiliate@linkkart.com")
                    .password(passwordEncoder.encode("password123"))
                    .status("ACTIVE")
                    .role(affiliateRole)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(affiliate);
        }

        // Target Categories
        String[] categoriesToSeed = {
                "Electronics", "Fashion", "Beauty", "Home & Kitchen", "Fitness", "Accessories", "Gaming", "Software & Services"
        };
        Map<String, Category> categoryMap = new HashMap<>();

        for (String catName : categoriesToSeed) {
            Category category = categoryRepository.findByName(catName).orElse(null);
            if (category == null) {
                category = Category.builder()
                        .name(catName)
                        .description(catName + " products category")
                        .build();
                category = categoryRepository.save(category);
            }
            categoryMap.put(catName, category);
        }

        // Product names list for cleaning and seeding verification
        List<String> targetProductNames = List.of(
                // Category 1: Electronics
                "Sony WH-1000XM5 Wireless Headphones",
                "JBL Tune 770NC Wireless Headphones",
                "Samsung Galaxy Buds FE",
                "Logitech MX Master 3S Wireless Mouse",
                "Anker 20W USB-C Fast Charger",

                // Category 2: Fashion
                "Levi's Men's Slim Fit Jeans",
                "Nike Men's Running T-Shirt",
                "Adidas Women's Sports Shoes",
                "Puma Men's Casual Sneakers",
                "Allen Solly Men's Formal Shirt",

                // Category 3: Beauty
                "L'Oréal Paris Hyaluron Moisture Shampoo",
                "Maybelline New York Matte Lipstick",
                "The Face Shop Rice Water Bright Cleanser",
                "Neutrogena Hydro Boost Water Gel",
                "Minimalist 10% Niacinamide Face Serum",

                // Category 4: Home & Kitchen
                "Philips Air Fryer 4.1L",
                "Prestige Electric Kettle 1.5L",
                "Bajaj Mixer Grinder 500W",
                "Milton Thermosteel Flask 1L",
                "IKEA LED Desk Lamp",

                // Category 5: Fitness
                "Decathlon Adjustable Dumbbell Set",
                "Boldfit Yoga Mat",
                "Fitbit Inspire 3 Fitness Tracker",
                "Boldfit Resistance Band Set",
                "Nike Training Gym Bag",

                // Category 6: Accessories
                "Apple AirTag",
                "Samsung 25W USB-C Adapter",
                "Portronics Power Plate 10 Power Strip",
                "Wildcraft Laptop Backpack 30L",
                "Fastrack Analog Watch",

                // Category 7: Gaming
                "Sony PlayStation 5 DualSense Controller",
                "Logitech G102 Gaming Mouse",
                "Razer BlackShark V2 X Gaming Headset",
                "Cosmic Byte CB-GK-18 Gaming Keyboard",
                "Xbox Wireless Controller",

                // Category 8: Software & Services
                "Canva Pro — 1 Month",
                "Adobe Creative Cloud — 1 Month",
                "Microsoft 365 Personal — 1 Year",
                "NordVPN — 1 Month",
                "Grammarly Premium — 1 Month"
        );

        // --- Clean up old database products and orphan tracking records ---
        log.info("Cleaning up old database products and orphan tracking records...");
        
        // 1. Delete commissions that reference conversions referencing affiliate links of products not in the target list
        entityManager.createNativeQuery(
            "DELETE comm FROM commissions comm " +
            "JOIN conversions conv ON comm.conversion_id = conv.id " +
            "JOIN affiliate_links al ON conv.affiliate_link_id = al.id " +
            "JOIN products p ON al.product_id = p.id " +
            "WHERE p.name NOT IN (:names)"
        ).setParameter("names", targetProductNames).executeUpdate();

        // 2. Delete conversions referencing affiliate links of products not in the target list
        entityManager.createNativeQuery(
            "DELETE conv FROM conversions conv " +
            "JOIN affiliate_links al ON conv.affiliate_link_id = al.id " +
            "JOIN products p ON al.product_id = p.id " +
            "WHERE p.name NOT IN (:names)"
        ).setParameter("names", targetProductNames).executeUpdate();

        // 3. Delete clicks referencing affiliate links of products not in the target list
        entityManager.createNativeQuery(
            "DELETE cl FROM clicks cl " +
            "JOIN affiliate_links al ON cl.affiliate_link_id = al.id " +
            "JOIN products p ON al.product_id = p.id " +
            "WHERE p.name NOT IN (:names)"
        ).setParameter("names", targetProductNames).executeUpdate();

        // 4. Delete affiliate links of products not in the target list
        entityManager.createNativeQuery(
            "DELETE al FROM affiliate_links al " +
            "JOIN products p ON al.product_id = p.id " +
            "WHERE p.name NOT IN (:names)"
        ).setParameter("names", targetProductNames).executeUpdate();

        // 5. Delete products not in the target list
        entityManager.createNativeQuery(
            "DELETE FROM products WHERE name NOT IN (:names)"
        ).setParameter("names", targetProductNames).executeUpdate();

        // 6. Delete categories that are not in our target 8 categories
        entityManager.createNativeQuery(
            "DELETE FROM categories WHERE name NOT IN (:categories)"
        ).setParameter("categories", List.of(categoriesToSeed)).executeUpdate();

        log.info("Cleanup completed successfully.");

        // --- Seeding 40 Target Products ---
        log.info("Seeding 40 target products...");

        // Category 1: Electronics
        seedProduct("Sony WH-1000XM5 Wireless Headphones",
                "Premium wireless over-ear headphones with active noise cancellation, high-resolution audio, and long battery life.",
                29990.00, 8.00,
                "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.sony.co.in/electronics/headband-headphones/wh-1000xm5",
                categoryMap.get("Electronics"), organization);

        seedProduct("JBL Tune 770NC Wireless Headphones",
                "Wireless over-ear headphones with adaptive noise cancellation, JBL Pure Bass sound, and up to 70 hours of battery life.",
                7999.00, 8.00,
                "https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.jbl.com.in/over-ear-headphones/JBLT770NC.html",
                categoryMap.get("Electronics"), organization);

        seedProduct("Samsung Galaxy Buds FE",
                "True wireless earbuds with active noise cancellation, ergonomic fit, powerful bass, and seamless connectivity.",
                5999.00, 7.00,
                "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.samsung.com/in/audio-sound/galaxy-buds/galaxy-buds-fe-white-sm-r400nzwainu/",
                categoryMap.get("Electronics"), organization);

        seedProduct("Logitech MX Master 3S Wireless Mouse",
                "Ergonomic wireless mouse with 8K DPI tracking, quiet clicks, and MagSpeed electromagnetic scrolling.",
                8495.00, 6.00,
                "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.logitech.com/en-in/products/mice/mx-master-3s.910-006561.html",
                categoryMap.get("Electronics"), organization);

        seedProduct("Anker 20W USB-C Fast Charger",
                "Ultra-compact fast charger for phones and tablets, featuring PowerIQ 3.0 technology for high-speed charging.",
                1499.00, 5.00,
                "https://images.pexels.com/photos/6823758/pexels-photo-6823758.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.anker.com/products/a2633",
                categoryMap.get("Electronics"), organization);

        // Category 2: Fashion
        seedProduct("Levi's Men's Slim Fit Jeans",
                "Classic slim-fit jeans with a modern look, crafted from premium stretch denim for all-day comfort.",
                2999.00, 10.00,
                "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.levi.in/men/clothing/jeans",
                categoryMap.get("Fashion"), organization);

        seedProduct("Nike Men's Running T-Shirt",
                "Lightweight and breathable athletic t-shirt with sweat-wicking technology to keep you dry and comfortable.",
                2495.00, 8.00,
                "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.nike.com/in/t/dri-fit-running-t-shirt",
                categoryMap.get("Fashion"), organization);

        seedProduct("Adidas Women's Sports Shoes",
                "Performance running shoes for women, featuring a cushioned midsole and a breathable mesh upper.",
                4999.00, 9.00,
                "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.adidas.co.in/running-shoes",
                categoryMap.get("Fashion"), organization);

        seedProduct("Puma Men's Casual Sneakers",
                "Classic court-style casual sneakers with a durable leather upper and soft cushioned sockliner.",
                3499.00, 8.00,
                "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://in.puma.com/in/en/mens/mens-shoes/mens-shoes-sneakers",
                categoryMap.get("Fashion"), organization);

        seedProduct("Allen Solly Men's Formal Shirt",
                "Premium cotton formal shirt with a sharp structure, perfect for business meetings and formal occasions.",
                1799.00, 10.00,
                "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.allensolly.com/mens-shirts",
                categoryMap.get("Fashion"), organization);

        // Category 3: Beauty
        seedProduct("L'Oréal Paris Hyaluron Moisture Shampoo",
                "Hydrating shampoo enriched with hyaluronic acid to lock in moisture and leave hair shiny and bouncy.",
                599.00, 12.00,
                "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.lorealparis.co.in/hair-care/shampoo",
                categoryMap.get("Beauty"), organization);

        seedProduct("Maybelline New York Matte Lipstick",
                "Intense matte lipstick with a comfortable, non-drying formula that lasts for up to 16 hours.",
                499.00, 12.00,
                "https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.maybelline.co.in/lips/lipstick",
                categoryMap.get("Beauty"), organization);

        seedProduct("The Face Shop Rice Water Bright Cleanser",
                "Gentle foaming cleanser infused with rice water to brighten and hydrate the skin while removing impurities.",
                899.00, 10.00,
                "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://thefaceshop.in/products/rice-water-bright-foaming-cleanser",
                categoryMap.get("Beauty"), organization);

        seedProduct("Neutrogena Hydro Boost Water Gel",
                "Oil-free face moisturizer with hyaluronic acid, offering intense hydration in a lightweight gel formula.",
                950.00, 10.00,
                "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.neutrogena.in/face/moisturizers/hydro-boost-water-gel",
                categoryMap.get("Beauty"), organization);

        seedProduct("Minimalist 10% Niacinamide Face Serum",
                "Nourishing face serum that reduces blemishes, controls sebum production, and improves skin barrier health.",
                699.00, 12.00,
                "https://images.pexels.com/photos/286951/pexels-photo-286951.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://aqualogica.in/products/glow-dewy-serum",
                categoryMap.get("Beauty"), organization);

        // Category 4: Home & Kitchen
        seedProduct("Philips Air Fryer 4.1L",
                "Compact air fryer with Rapid Air technology to fry, bake, grill, and roast with up to 90% less fat.",
                6499.00, 7.00,
                "https://images.pexels.com/photos/4259707/pexels-photo-4259707.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.philips.co.in/c-e/ho/cooking/airfryer",
                categoryMap.get("Home & Kitchen"), organization);

        seedProduct("Prestige Electric Kettle 1.5L",
                "Stainless steel electric kettle with automatic shut-off and single-touch lid lock for quick boiling.",
                1499.00, 8.00,
                "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.prestigesmartkitchen.com/electric-kettles",
                categoryMap.get("Home & Kitchen"), organization);

        seedProduct("Bajaj Mixer Grinder 500W",
                "Powerful mixer grinder with 3 stainless steel jars, designed for efficient wet and dry grinding.",
                2799.00, 7.00,
                "https://images.pexels.com/photos/38325/vacuum-cleaner-carpet-cleaner-housework-38325.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.bajajelectricals.com/mixer-grinders",
                categoryMap.get("Home & Kitchen"), organization);

        seedProduct("Milton Thermosteel Flask 1L",
                "Double-walled vacuum insulated flask that keeps beverages hot or cold for up to 24 hours.",
                999.00, 8.00,
                "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.milton.in/products/thermosteel-flasks",
                categoryMap.get("Home & Kitchen"), organization);

        seedProduct("IKEA LED Desk Lamp",
                "Adjustable and energy-efficient LED desk lamp, providing focused light for work or study.",
                1299.00, 9.00,
                "https://images.pexels.com/photos/1125137/pexels-photo-1125137.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.ikea.com/in/en/cat/work-lamps-20502/",
                categoryMap.get("Home & Kitchen"), organization);

        // Category 5: Fitness
        seedProduct("Decathlon Adjustable Dumbbell Set",
                "Versatile adjustable dumbbell set, perfect for home workouts and targeting multiple muscle groups.",
                4999.00, 8.00,
                "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.decathlon.in/dumbbells",
                categoryMap.get("Fitness"), organization);

        seedProduct("Boldfit Yoga Mat",
                "Extra-thick slip-resistant yoga mat with a carrying strap, designed for yoga, pilates, and floor exercises.",
                799.00, 12.00,
                "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.boldfit.in/collections/yoga-mats",
                categoryMap.get("Fitness"), organization);

        seedProduct("Fitbit Inspire 3 Fitness Tracker",
                "Slim fitness tracker with 24/7 heart rate monitoring, sleep tracking, and up to 10 days of battery life.",
                8999.00, 6.00,
                "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.fitbit.com/global/in/products/trackers/inspire3",
                categoryMap.get("Fitness"), organization);

        seedProduct("Boldfit Resistance Band Set",
                "Set of 5 premium latex resistance bands with different resistance levels for comprehensive strength training.",
                699.00, 12.00,
                "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.boldfit.in/collections/resistance-bands",
                categoryMap.get("Fitness"), organization);

        seedProduct("Nike Training Gym Bag",
                "Durable and spacious gym duffel bag with specialized compartments for shoes and wet/dry gear.",
                2999.00, 8.00,
                "https://images.pexels.com/photos/4162579/pexels-photo-4162579.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.nike.com/in/t/gym-duffel-bag",
                categoryMap.get("Fitness"), organization);

        // Category 6: Accessories
        seedProduct("Apple AirTag",
                "Compact smart tracking device that helps you locate keys, bags, and other personal items via Find My app.",
                3490.00, 5.00,
                "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.apple.com/in/airtag/",
                categoryMap.get("Accessories"), organization);

        seedProduct("Samsung 25W USB-C Adapter",
                "Fast wall charger with USB-C PD 3.0 technology, providing optimal charging speeds for Samsung devices.",
                1299.00, 6.00,
                "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.samsung.com/in/mobile-accessories/25w-power-adapter-black-ep-ta800nbinin/",
                categoryMap.get("Accessories"), organization);

        seedProduct("Portronics Power Plate 10 Power Strip",
                "Multi-port extension board and power strip with surge protection and smart USB charging ports.",
                1099.00, 8.00,
                "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
                "https://www.portronics.com/products/power-plate-10",
                categoryMap.get("Accessories"), organization);

        seedProduct("Wildcraft Laptop Backpack 30L",
                "Ergonomic water-resistant laptop backpack with multiple organizational pockets and padded straps.",
                1999.00, 10.00,
                "https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://wildcraft.com/bags/backpacks",
                categoryMap.get("Accessories"), organization);

        seedProduct("Fastrack Analog Watch",
                "Trendy casual analog watch for youth, featuring a sporty dial design and durable strap.",
                2495.00, 9.00,
                "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.fastrack.in/watches",
                categoryMap.get("Accessories"), organization);

        // Category 7: Gaming
        seedProduct("Sony PlayStation 5 DualSense Controller",
                "Wireless controller for PS5 featuring haptic feedback, dynamic adaptive triggers, and built-in microphone.",
                5499.00, 5.00,
                "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.playstation.com/en-in/accessories/dualsense-wireless-controller/",
                categoryMap.get("Gaming"), organization);

        seedProduct("Logitech G102 Gaming Mouse",
                "Entry-level wired gaming mouse with customizable RGB lighting and gaming-grade 8,000 DPI sensor.",
                1799.00, 8.00,
                "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.logitechg.com/en-in/products/gaming-mice/g102-lightsync-gear.910-005802.html",
                categoryMap.get("Gaming"), organization);

        seedProduct("Razer BlackShark V2 X Gaming Headset",
                "Lightweight multi-platform esports gaming headset with 50mm drivers and advanced passive noise cancellation.",
                4499.00, 7.00,
                "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.razer.com/gaming-headsets/razer-blackshark-v2-x",
                categoryMap.get("Gaming"), organization);

        seedProduct("Cosmic Byte CB-GK-18 Gaming Keyboard",
                "Tenkeyless mechanical gaming keyboard with customizable rainbow LED backlighting and blue switches.",
                1699.00, 10.00,
                "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.thecosmicbyte.com/product/cosmic-byte-cb-gk-18-firefly-tkl-per-key-rgb-mechanical-keyboard/",
                categoryMap.get("Gaming"), organization);

        seedProduct("Xbox Wireless Controller",
                "Official Microsoft Xbox wireless controller with textured grip and share button, compatible with consoles and PC.",
                5490.00, 5.00,
                "https://images.pexels.com/photos/7915509/pexels-photo-7915509.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.xbox.com/en-IN/accessories/controllers/xbox-wireless-controller",
                categoryMap.get("Gaming"), organization);

        // Category 8: Software & Services
        seedProduct("Canva Pro — 1 Month",
                "One-month access to Canva Pro, offering premium stock photos, brand kits, and advanced design tools.",
                499.00, 20.00,
                "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.canva.com/pro/",
                categoryMap.get("Software & Services"), organization);

        seedProduct("Adobe Creative Cloud — 1 Month",
                "One-month subscription to Adobe Creative Cloud, providing full access to Photoshop, Illustrator, and more.",
                4230.00, 15.00,
                "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.adobe.com/in/creativecloud.html",
                categoryMap.get("Software & Services"), organization);

        seedProduct("Microsoft 365 Personal — 1 Year",
                "One-year subscription to Microsoft 365 Personal, including Word, Excel, PowerPoint, and 1TB cloud storage.",
                6199.00, 12.00,
                "https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.microsoft.com/en-in/microsoft-365/buy/microsoft-365-personal",
                categoryMap.get("Software & Services"), organization);

        seedProduct("NordVPN — 1 Month",
                "One-month high-speed secure VPN subscription, protecting your online identity and personal data.",
                899.00, 20.00,
                "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://nordvpn.com/",
                categoryMap.get("Software & Services"), organization);

        seedProduct("Grammarly Premium — 1 Month",
                "One-month subscription to Grammarly Premium, helping you write clearly, concisely, and professionally.",
                1000.00, 15.00,
                "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600",
                "https://www.grammarly.com/premium",
                categoryMap.get("Software & Services"), organization);

        log.info("Catalog seeding finished successfully! Total products in database: {}", productRepository.count());
    }

    private void seedProduct(String name, String desc, double price, double commRate, String imgUrl, String destUrl, Category category, Organization organization) {
        Product product = productRepository.findByName(name).orElse(null);
        if (product == null) {
            product = new Product();
            product.setName(name);
        }
        product.setPrice(BigDecimal.valueOf(price));
        product.setStatus("ACTIVE");
        product.setCategory(category);
        product.setOrganization(organization);
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(LocalDateTime.now());
        }
        productRepository.save(product);
    }
}
