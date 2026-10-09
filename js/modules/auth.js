// ==========================================================================
// LINGOMASTER PRO - AVTORIZATSIYA VA FOYDALANUVCHI PROFILI MODULI
// ==========================================================================

const STORAGE_USERS = "lingomaster_users";
const STORAGE_CURRENT_USER = "lingomaster_current_user";

export const AVATARS = [
  "👨‍🎓", "👩‍🎓", "🦁", "🚀", "⚡", "🌟", "🦅", "💡", "🎯", "🦊", "👑", "🔥"
];

class AuthManager {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
    this.ensureDefaultData();
  }

  loadUsers() {
    try {
      const data = localStorage.getItem(STORAGE_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveUsers() {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(this.users));
    } catch (e) {
      console.error(e);
    }
  }

  loadCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveCurrentUser() {
    try {
      if (this.currentUser) {
        localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(this.currentUser));
        // Foydalanuvchilar bazasidagi nusxasini ham yangilash
        const idx = this.users.findIndex(u => u.username === this.currentUser.username);
        if (idx !== -1) {
          this.users[idx] = this.currentUser;
          this.saveUsers();
        }
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }

  ensureDefaultData() {
    // Agar foydalanuvchi tizimga kirmagan bo'lsa, xushmuomala demo o'quvchi yoki mehmon tayyorlash
    if (!this.currentUser) {
      // Standart mehmon akkaunti
      this.currentUser = {
        name: "Mehmon O'quvchi",
        username: "guest_" + Math.floor(Math.random() * 8999 + 1000),
        avatar: "🚀",
        level: "A1",
        xp: 120,
        rankLevel: 1,
        testsCompleted: 3,
        correctAnswers: 24,
        totalQuestions: 30,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        badges: ["first_step"],
        isGuest: true
      };
      this.saveCurrentUser();
    }
  }

  register(name, username, password, level = "A1", avatar = "👨‍🎓") {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password || !name) {
      return { success: false, message: "Barcha maydonlarni to'ldiring!" };
    }

    if (this.users.some(u => u.username === cleanUsername)) {
      return { success: false, message: "Bu foydalanuvchi nomi band! Boshqasini tanlang." };
    }

    const newUser = {
      name: name.trim(),
      username: cleanUsername,
      password: password, // Lokal saqlash
      avatar: avatar || "👨‍🎓",
      level: level, // Foydalanuvchining boshlang'ich darajasi: A1, A2, B1, B2, C1
      xp: 0,
      rankLevel: 1,
      testsCompleted: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      badges: ["newbie"],
      isGuest: false,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    this.currentUser = newUser;
    this.saveCurrentUser();

    return { success: true, user: newUser };
  }

  login(username, password) {
    const cleanUsername = username.trim().toLowerCase();
    const user = this.users.find(u => u.username === cleanUsername && u.password === password);

    if (!user) {
      return { success: false, message: "Login yoki parol noto'g'ri!" };
    }

    // Streak tekshirish
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        user.streak = (user.streak || 0) + 1;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = today;
    }

    this.currentUser = user;
    this.saveCurrentUser();
    return { success: true, user };
  }

  logout() {
    this.currentUser = null;
    this.ensureDefaultData();
    return true;
  }

  addQuizResult(score, total, xpGained = 0) {
    if (!this.currentUser) return;

    this.currentUser.testsCompleted = (this.currentUser.testsCompleted || 0) + 1;
    this.currentUser.correctAnswers = (this.currentUser.correctAnswers || 0) + score;
    this.currentUser.totalQuestions = (this.currentUser.totalQuestions || 0) + total;
    this.currentUser.xp = (this.currentUser.xp || 0) + xpGained;

    // Rank Level hisoblash (har 200 XP da daraja oshadi)
    this.currentUser.rankLevel = Math.floor(this.currentUser.xp / 200) + 1;

    // Badges tekshirish
    const badges = this.currentUser.badges || [];
    if (score === total && total >= 5 && !badges.includes("perfect_score")) {
      badges.push("perfect_score");
    }
    if (this.currentUser.testsCompleted >= 10 && !badges.includes("master_10")) {
      badges.push("master_10");
    }
    if (this.currentUser.xp >= 1000 && !badges.includes("xp_1000")) {
      badges.push("xp_1000");
    }
    this.currentUser.badges = badges;

    this.saveCurrentUser();
  }

  updateLevel(newLevel) {
    if (this.currentUser) {
      this.currentUser.level = newLevel;
      this.saveCurrentUser();
    }
  }

  getAccuracy() {
    if (!this.currentUser || !this.currentUser.totalQuestions) return 0;
    return Math.round((this.currentUser.correctAnswers / this.currentUser.totalQuestions) * 100);
  }
}

export const authManager = new AuthManager();
