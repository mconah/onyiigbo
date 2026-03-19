import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

/**
 * Appwrite Database Setup Script for Ọnyịịgbọ
 * 
 * Usage: 
 * 1. Set environment variables:
 *    - APPWRITE_ENDPOINT
 *    - APPWRITE_PROJECT_ID
 *    - APPWRITE_API_KEY
 * 
 * 2. Run: npx ts-node scripts/setup-appwrite.ts
 * 
 * Or provide values as arguments:
 * npx ts-node scripts/setup-appwrite.ts https://cloud.appwrite.io/v1 projectId apiKey
 */

const endpoint = process.argv[2] || process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.argv[3] || process.env.VITE_APPWRITE_PROJECT_ID || 'onyiigbo';
const apiKey = process.argv[4] || process.env.APPWRITE_API_KEY || 'standard_579eee5956c3c62031b3f8ddf8820c4139296e9ef03fb43b065371e674f3af58954901da848f721ab83b4fc982c07e241978dcc997f9b81a94a1a774231fea4ac3863664d71310f37e414576bdfce343c56d01aaeabbea8d87a9785b3b5e2298bf9e6d78d7097d06db24c6297b43d463a011e55d660330747e4d1be57279220c';

if (!endpoint || !projectId || !apiKey) {
  console.error('❌ Missing required configuration. Please provide:');
  console.error('   - APPWRITE_ENDPOINT (e.g., https://cloud.appwrite.io/v1)');
  console.error('   - APPWRITE_PROJECT_ID');
  console.error('   - APPWRITE_API_KEY');
  console.error('');
  console.error('   Via environment variables or command line arguments.');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = 'onyiigbo_database';

export const COLLECTIONS = {
  USERS: 'users',
  SERVICE_REQUESTS: 'service_requests',
  SERVICE_PROVIDERS: 'service_providers',
  BLOG_POSTS: 'blog_posts',
  NEWS_POSTS: 'news_posts',
  CHATS: 'chats',
  MESSAGES: 'messages',
  CONTRIBUTOR_STATS: 'contributor_stats',
  CONTRIBUTOR_POINTS: 'contributor_points',
  BADGES: 'badges',
  USER_BADGES: 'user_badges',
  REWARDS: 'rewards',
  USER_REWARDS: 'user_rewards',
  VERIFICATION_REQUESTS: 'verification_requests',
  CAREERS: 'careers',
  JOB_APPLICATIONS: 'job_applications',
  ACCESSIBILITY_SETTINGS: 'accessibility_settings',
};

// Collection attributes configuration
const collectionConfig: Record<string, { name: string; attributes: Array<{ key: string; type: string; required?: boolean; size?: number; array?: boolean; elements?: string[] }> }> = {
  [COLLECTIONS.USERS]: {
    name: 'Users',
    attributes: [
      { key: 'appwrite_user_id', type: 'string', required: true, size: 255 },
      { key: 'name', type: 'string', required: true, size: 255 },
      { key: 'email', type: 'string', required: true, size: 255 },
      { key: 'role', type: 'string', required: true, size: 50 }, // Admin, Contributor, ServiceProvider, Student
      { key: 'status', type: 'string', required: true, size: 50 }, // Active, Pending, Suspended
      { key: 'interests', type: 'string', required: false, size: 1000, array: true },
      { key: 'joined', type: 'string', required: true, size: 50 },
      { key: 'bio', type: 'string', required: false, size: 2000 },
      { key: 'location', type: 'string', required: false, size: 255 },
      { key: 'specialty', type: 'string', required: false, size: 100 },
      { key: 'avatar', type: 'string', required: false, size: 500 },
      { key: 'availability', type: 'string', required: false, size: 50 },
      { key: 'language_preference', type: 'string', required: false, size: 10 }, // ig, en
      { key: 'total_points', type: 'integer', required: false },
      { key: 'level', type: 'integer', required: false },
      { key: 'is_verified', type: 'boolean', required: false },
      { key: 'accessibility_enabled', type: 'boolean', required: false },
    ]
  },
  [COLLECTIONS.SERVICE_REQUESTS]: {
    name: 'Service Requests',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'service_type', type: 'string', required: true, size: 100 },
      { key: 'details', type: 'string', required: true, size: 3000 },
      { key: 'status', type: 'string', required: true, size: 50 }, // Pending, In Progress, Completed
      { key: 'created_at', type: 'string', required: true, size: 50 },
      { key: 'assigned_provider_id', type: 'string', required: false, size: 255 },
      { key: 'budget', type: 'string', required: false, size: 100 },
      { key: 'deadline', type: 'string', required: false, size: 50 },
    ]
  },
  [COLLECTIONS.SERVICE_PROVIDERS]: {
    name: 'Service Providers',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'services_offered', type: 'string', required: true, size: 100, array: true },
      { key: 'hourly_rate', type: 'string', required: false, size: 50 },
      { key: 'verification_status', type: 'string', required: true, size: 50 }, // Pending, Verified, Rejected
      { key: 'verification_documents', type: 'string', required: false, size: 500, array: true },
      { key: 'verified_by', type: 'string', required: false, size: 255 },
      { key: 'verified_at', type: 'string', required: false, size: 50 },
      { key: 'rating', type: 'double', required: false },
      { key: 'total_reviews', type: 'integer', required: false },
      { key: 'completed_jobs', type: 'integer', required: false },
      { key: 'qualifications', type: 'string', required: false, size: 1000 },
      { key: 'years_experience', type: 'integer', required: false },
    ]
  },
  [COLLECTIONS.BLOG_POSTS]: {
    name: 'Blog Posts',
    attributes: [
      { key: 'title', type: 'string', required: true, size: 255 },
      { key: 'title_igbo', type: 'string', required: false, size: 255 },
      { key: 'content', type: 'string', required: true, size: 50000 },
      { key: 'content_igbo', type: 'string', required: false, size: 50000 },
      { key: 'author_id', type: 'string', required: true, size: 255 },
      { key: 'author_name', type: 'string', required: true, size: 255 },
      { key: 'status', type: 'string', required: true, size: 50 }, // Draft, Published, Archived
      { key: 'category', type: 'string', required: false, size: 100 },
      { key: 'tags', type: 'string', required: false, size: 100, array: true },
      { key: 'featured_image', type: 'string', required: false, size: 500 },
      { key: 'created_at', type: 'string', required: true, size: 50 },
      { key: 'published_at', type: 'string', required: false, size: 50 },
      { key: 'views', type: 'integer', required: false },
      { key: 'likes', type: 'integer', required: false },
    ]
  },
  [COLLECTIONS.NEWS_POSTS]: {
    name: 'News Posts',
    attributes: [
      { key: 'title', type: 'string', required: true, size: 255 },
      { key: 'title_igbo', type: 'string', required: false, size: 255 },
      { key: 'content', type: 'string', required: true, size: 50000 },
      { key: 'content_igbo', type: 'string', required: false, size: 50000 },
      { key: 'author_id', type: 'string', required: true, size: 255 },
      { key: 'author_name', type: 'string', required: true, size: 255 },
      { key: 'status', type: 'string', required: true, size: 50 },
      { key: 'category', type: 'string', required: false, size: 100 },
      { key: 'featured_image', type: 'string', required: false, size: 500 },
      { key: 'created_at', type: 'string', required: true, size: 50 },
      { key: 'published_at', type: 'string', required: false, size: 50 },
      { key: 'is_featured', type: 'boolean', required: false },
      { key: 'views', type: 'integer', required: false },
    ]
  },
  [COLLECTIONS.CHATS]: {
    name: 'Chats',
    attributes: [
      { key: 'participants', type: 'string', required: true, size: 255, array: true },
      { key: 'participant_names', type: 'string', required: true, size: 255, array: true },
      { key: 'created_at', type: 'string', required: true, size: 50 },
      { key: 'last_message_at', type: 'string', required: false, size: 50 },
      { key: 'last_message_preview', type: 'string', required: false, size: 500 },
    ]
  },
  [COLLECTIONS.MESSAGES]: {
    name: 'Messages',
    attributes: [
      { key: 'chat_id', type: 'string', required: true, size: 255 },
      { key: 'sender_id', type: 'string', required: true, size: 255 },
      { key: 'sender_name', type: 'string', required: true, size: 255 },
      { key: 'content', type: 'string', required: true, size: 5000 },
      { key: 'created_at', type: 'string', required: true, size: 50 },
      { key: 'read_by', type: 'string', required: false, size: 255, array: true },
    ]
  },
  [COLLECTIONS.CONTRIBUTOR_STATS]: {
    name: 'Contributor Statistics',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'total_articles', type: 'integer', required: false },
      { key: 'total_translations', type: 'integer', required: false },
      { key: 'total_tutoring_hours', type: 'integer', required: false },
      { key: 'total_points_earned', type: 'integer', required: false },
      { key: 'current_level', type: 'integer', required: false },
      { key: 'rank', type: 'string', required: false, size: 50 },
      { key: 'streak_days', type: 'integer', required: false },
      { key: 'last_contribution_date', type: 'string', required: false, size: 50 },
      { key: 'updated_at', type: 'string', required: true, size: 50 },
    ]
  },
  [COLLECTIONS.CONTRIBUTOR_POINTS]: {
    name: 'Contributor Points Log',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'action_type', type: 'string', required: true, size: 100 }, // write_article, translate, teach, etc.
      { key: 'points_earned', type: 'integer', required: true },
      { key: 'reference_id', type: 'string', required: false, size: 255 }, // ID of article, translation, etc.
      { key: 'reference_type', type: 'string', required: false, size: 50 },
      { key: 'description', type: 'string', required: false, size: 500 },
      { key: 'created_at', type: 'string', required: true, size: 50 },
    ]
  },
  [COLLECTIONS.BADGES]: {
    name: 'Badges',
    attributes: [
      { key: 'name', type: 'string', required: true, size: 100 },
      { key: 'name_igbo', type: 'string', required: false, size: 100 },
      { key: 'description', type: 'string', required: true, size: 500 },
      { key: 'description_igbo', type: 'string', required: false, size: 500 },
      { key: 'icon', type: 'string', required: false, size: 255 },
      { key: 'requirement_type', type: 'string', required: true, size: 50 }, // points, articles, translations, etc.
      { key: 'requirement_value', type: 'integer', required: true },
      { key: 'category', type: 'string', required: false, size: 50 },
      { key: 'rarity', type: 'string', required: false, size: 50 }, // common, rare, epic, legendary
    ]
  },
  [COLLECTIONS.USER_BADGES]: {
    name: 'User Badges',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'badge_id', type: 'string', required: true, size: 255 },
      { key: 'earned_at', type: 'string', required: true, size: 50 },
      { key: 'display_order', type: 'integer', required: false },
      { key: 'is_featured', type: 'boolean', required: false },
    ]
  },
  [COLLECTIONS.REWARDS]: {
    name: 'Rewards',
    attributes: [
      { key: 'name', type: 'string', required: true, size: 100 },
      { key: 'name_igbo', type: 'string', required: false, size: 100 },
      { key: 'description', type: 'string', required: true, size: 500 },
      { key: 'description_igbo', type: 'string', required: false, size: 500 },
      { key: 'type', type: 'string', required: true, size: 50 }, // badge, premium_access, certificate, etc.
      { key: 'points_cost', type: 'integer', required: true },
      { key: 'icon', type: 'string', required: false, size: 255 },
      { key: 'is_active', type: 'boolean', required: false },
      { key: 'stock', type: 'integer', required: false }, // -1 for unlimited
      { key: 'redeemed_count', type: 'integer', required: false },
    ]
  },
  [COLLECTIONS.USER_REWARDS]: {
    name: 'User Rewards',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'reward_id', type: 'string', required: true, size: 255 },
      { key: 'redeemed_at', type: 'string', required: true, size: 50 },
      { key: 'points_spent', type: 'integer', required: true },
      { key: 'status', type: 'string', required: true, size: 50 }, // pending, delivered, used
      { key: 'delivered_at', type: 'string', required: false, size: 50 },
      { key: 'notes', type: 'string', required: false, size: 500 },
    ]
  },
  [COLLECTIONS.VERIFICATION_REQUESTS]: {
    name: 'Verification Requests',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'request_type', type: 'string', required: true, size: 50 }, // service_provider, contributor
      { key: 'status', type: 'string', required: true, size: 50 }, // Pending, Approved, Rejected
      { key: 'submitted_at', type: 'string', required: true, size: 50 },
      { key: 'documents', type: 'string', required: false, size: 500, array: true },
      { key: 'notes', type: 'string', required: false, size: 2000 },
      { key: 'reviewed_by', type: 'string', required: false, size: 255 },
      { key: 'reviewed_at', type: 'string', required: false, size: 50 },
      { key: 'rejection_reason', type: 'string', required: false, size: 1000 },
    ]
  },
  [COLLECTIONS.CAREERS]: {
    name: 'Career Positions',
    attributes: [
      { key: 'title', type: 'string', required: true, size: 255 },
      { key: 'title_igbo', type: 'string', required: false, size: 255 },
      { key: 'department', type: 'string', required: true, size: 100 },
      { key: 'department_igbo', type: 'string', required: false, size: 100 },
      { key: 'description', type: 'string', required: true, size: 3000 },
      { key: 'description_igbo', type: 'string', required: false, size: 3000 },
      { key: 'requirements', type: 'string', required: true, size: 3000, array: true },
      { key: 'requirements_igbo', type: 'string', required: false, size: 3000, array: true },
      { key: 'responsibilities', type: 'string', required: true, size: 3000, array: true },
      { key: 'responsibilities_igbo', type: 'string', required: false, size: 3000, array: true },
      { key: 'employment_type', type: 'string', required: true, size: 50 }, // full_time, part_time, contract
      { key: 'location', type: 'string', required: true, size: 100 },
      { key: 'salary_range', type: 'string', required: false, size: 100 },
      { key: 'is_active', type: 'boolean', required: false },
      { key: 'posted_at', type: 'string', required: true, size: 50 },
      { key: 'closes_at', type: 'string', required: false, size: 50 },
    ]
  },
  [COLLECTIONS.JOB_APPLICATIONS]: {
    name: 'Job Applications',
    attributes: [
      { key: 'career_id', type: 'string', required: true, size: 255 },
      { key: 'applicant_id', type: 'string', required: true, size: 255 },
      { key: 'applicant_name', type: 'string', required: true, size: 255 },
      { key: 'applicant_email', type: 'string', required: true, size: 255 },
      { key: 'resume_url', type: 'string', required: false, size: 500 },
      { key: 'cover_letter', type: 'string', required: false, size: 3000 },
      { key: 'portfolio_url', type: 'string', required: false, size: 500 },
      { key: 'status', type: 'string', required: true, size: 50 }, // Pending, Reviewing, Interview, Hired, Rejected
      { key: 'applied_at', type: 'string', required: true, size: 50 },
      { key: 'notes', type: 'string', required: false, size: 2000 },
      { key: 'reviewed_by', type: 'string', required: false, size: 255 },
      { key: 'reviewed_at', type: 'string', required: false, size: 50 },
    ]
  },
  [COLLECTIONS.ACCESSIBILITY_SETTINGS]: {
    name: 'Accessibility Settings',
    attributes: [
      { key: 'user_id', type: 'string', required: true, size: 255 },
      { key: 'high_contrast', type: 'boolean', required: false },
      { key: 'large_font', type: 'boolean', required: false },
      { key: 'screen_reader_optimized', type: 'boolean', required: false },
      { key: 'reduced_motion', type: 'boolean', required: false },
      { key: 'keyboard_navigation_only', type: 'boolean', required: false },
      { key: 'color_blind_mode', type: 'string', required: false, size: 50 }, // none, protanopia, deuteranopia, tritanopia
      { key: 'font_size', type: 'string', required: false, size: 20 }, // small, medium, large, x-large
      { key: 'updated_at', type: 'string', required: true, size: 50 },
    ]
  },
};

// Default badges to populate
const defaultBadges = [
  { name: 'First Steps', name_igbo: 'Mbido', description: 'Created your first contribution', description_igbo: 'Kepụtara ihe mbụ gị', requirement_type: 'articles', requirement_value: 1, rarity: 'common', icon: '🌱' },
  { name: 'Writer', name_igbo: 'Odee', description: 'Published 5 articles', description_igbo: 'Bipụtara ederede ise', requirement_type: 'articles', requirement_value: 5, rarity: 'common', icon: '✍️' },
  { name: 'Storyteller', name_igbo: 'Akọ Akụkọ', description: 'Published 25 articles', description_igbo: 'Bipụtara ederede iri abụọ na ise', requirement_type: 'articles', requirement_value: 25, rarity: 'rare', icon: '📚' },
  { name: 'Translator', name_igbo: 'Ntụgharị', description: 'Completed 10 translations', description_igbo: 'Mechara ntụgharị iri', requirement_type: 'translations', requirement_value: 10, rarity: 'rare', icon: '🌐' },
  { name: 'Teacher', name_igbo: 'Nkuzi', description: 'Taught 20 hours', description_igbo: 'Kuziri awa iri abụọ', requirement_type: 'tutoring_hours', requirement_value: 20, rarity: 'rare', icon: '👨‍🏫' },
  { name: 'Cultural Champion', name_igbo: 'Nwa Odogwu', description: 'Earned 1000 points', description_igbo: 'Nwetara akara puku', requirement_type: 'points', requirement_value: 1000, rarity: 'epic', icon: '🏆' },
  { name: 'Igbo Ambassador', name_igbo: 'Ogene Igbo', description: 'Earned 5000 points', description_igbo: 'Nwetara akara puku ise', requirement_type: 'points', requirement_value: 5000, rarity: 'legendary', icon: '👑' },
  { name: 'Daily Contributor', name_igbo: 'Ndeputa Ụbọchị', description: '7 day contribution streak', description_igbo: 'Ndeputa ụbọchị asaa n连续', requirement_type: 'streak', requirement_value: 7, rarity: 'common', icon: '🔥' },
  { name: 'Dedicated', name_igbo: 'Sọọsọọ', description: '30 day contribution streak', description_igbo: 'Ndeputa ụbọchị iri atọ n连续', requirement_type: 'streak', requirement_value: 30, rarity: 'rare', icon: '💎' },
];

// Default rewards to populate
const defaultRewards = [
  { name: 'Featured Contributor Badge', name_igbo: 'Akara Ndeputa Pụtara', description: 'Get featured on our homepage for a week', description_igbo: 'Pụtara na ụlọ mbụ anyị maka izuụzọ', type: 'badge', points_cost: 500, icon: '⭐', is_active: true, stock: -1 },
  { name: 'Premium Access', name_igbo: 'Nweta Mmehe Pụrụ Iche', description: '1 month of premium platform access', description_igbo: 'Ọnwa otu nke nweta mmehe pụrụ iche', type: 'premium_access', points_cost: 1000, icon: '💎', is_active: true, stock: -1 },
  { name: 'Certificate of Achievement', name_igbo: 'Akwụkwọ Ike Mmere', description: 'Physical certificate mailed to you', description_igbo: 'Akwụkwọ ike zitere gị', type: 'certificate', points_cost: 2000, icon: '📜', is_active: true, stock: 100 },
  { name: 'Cultural Event Pass', name_igbo: 'Akwụkwọ Mmemme', description: 'Free pass to one cultural event', description_igbo: 'Akwụkwọ mmemme na-efu', type: 'event_pass', points_cost: 1500, icon: '🎫', is_active: true, stock: 50 },
];

async function setupDatabase() {
  console.log('🚀 Starting Ọnyịịgbọ Appwrite Database Setup...\n');

  try {
    // Create Database
    console.log(`📦 Creating database: ${DATABASE_ID}`);
    try {
      await databases.get(DATABASE_ID);
      console.log(`   ✓ Database already exists: ${DATABASE_ID}`);
    } catch {
      await databases.create(DATABASE_ID, 'Ọnyịịgbọ Database');
      console.log(`   ✓ Created database: ${DATABASE_ID}`);
    }

    // Create Collections
    console.log('\n📋 Creating collections...');
    for (const [collectionId, config] of Object.entries(collectionConfig)) {
      try {
        await databases.getCollection(DATABASE_ID, collectionId);
        console.log(`   ✓ Collection exists: ${config.name}`);
      } catch {
        await databases.createCollection(
          DATABASE_ID,
          collectionId,
          config.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ]
        );
        console.log(`   ✓ Created collection: ${config.name}`);

        // Create attributes
        for (const attr of config.attributes) {
          try {
            if (attr.type === 'string') {
              if (attr.array) {
                await databases.createStringAttribute(DATABASE_ID, collectionId, attr.key, attr.size || 255, attr.required || false, undefined, true);
              } else {
                await databases.createStringAttribute(DATABASE_ID, collectionId, attr.key, attr.size || 255, attr.required || false);
              }
            } else if (attr.type === 'integer') {
              await databases.createIntegerAttribute(DATABASE_ID, collectionId, attr.key, attr.required || false);
            } else if (attr.type === 'double') {
              await databases.createFloatAttribute(DATABASE_ID, collectionId, attr.key, attr.required || false);
            } else if (attr.type === 'boolean') {
              await databases.createBooleanAttribute(DATABASE_ID, collectionId, attr.key, attr.required || false);
            }
          } catch (attrError) {
            console.log(`     ⚠ Attribute ${attr.key} may already exist`);
          }
        }
        console.log(`     ✓ Added ${config.attributes.length} attributes`);
      }
    }

    // Populate default badges
    console.log('\n🏅 Populating default badges...');
    for (const badge of defaultBadges) {
      try {
        await databases.createDocument(DATABASE_ID, COLLECTIONS.BADGES, ID.unique(), badge);
        console.log(`   ✓ Created badge: ${badge.name}`);
      } catch {
        console.log(`   ⚠ Badge already exists or error: ${badge.name}`);
      }
    }

    // Populate default rewards
    console.log('\n🎁 Populating default rewards...');
    for (const reward of defaultRewards) {
      try {
        await databases.createDocument(DATABASE_ID, COLLECTIONS.REWARDS, ID.unique(), reward);
        console.log(`   ✓ Created reward: ${reward.name}`);
      } catch {
        console.log(`   ⚠ Reward already exists or error: ${reward.name}`);
      }
    }

    console.log('\n✅ Setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Database ID: ${DATABASE_ID}`);
    console.log(`   Collections: ${Object.keys(COLLECTIONS).length}`);
    console.log(`   Badges: ${defaultBadges.length}`);
    console.log(`   Rewards: ${defaultRewards.length}`);
    console.log('\n📝 Add these to your .env file:');
    console.log(`   VITE_APPWRITE_DATABASE_ID=${DATABASE_ID}`);
    console.log(`   VITE_APPWRITE_USERS_COLLECTION_ID=${COLLECTIONS.USERS}`);
    console.log(`   VITE_APPWRITE_SERVICE_REQUESTS_COLLECTION_ID=${COLLECTIONS.SERVICE_REQUESTS}`);
    console.log(`   VITE_APPWRITE_SERVICE_PROVIDERS_COLLECTION_ID=${COLLECTIONS.SERVICE_PROVIDERS}`);
    console.log(`   VITE_APPWRITE_BLOG_POSTS_COLLECTION_ID=${COLLECTIONS.BLOG_POSTS}`);
    console.log(`   VITE_APPWRITE_NEWS_POSTS_COLLECTION_ID=${COLLECTIONS.NEWS_POSTS}`);
    console.log(`   VITE_APPWRITE_CHATS_COLLECTION_ID=${COLLECTIONS.CHATS}`);
    console.log(`   VITE_APPWRITE_MESSAGES_COLLECTION_ID=${COLLECTIONS.MESSAGES}`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
