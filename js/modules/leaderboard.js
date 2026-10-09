// ==========================================================================
// LINGOMASTER PRO - REYTING VA PESHQADAMLAR JADVALI (LEADERBOARD)
// ==========================================================================

import { authManager } from './auth.js';

const STORAGE_LEADERBOARD = "lingomaster_leaderboard";

const DEFAULT_LEADERS = [
  { name: "Jasur Rahimov", username: "jasur_pro", avatar: "🦁", level: "C1", xp: 3420, rank: 1, testsCompleted: 78, accuracy: 96 },
  { name: "Madina Aliyeva", username: "madina_eng", avatar: "👩‍🎓", level: "B2", xp: 2890, rank: 2, testsCompleted: 62, accuracy: 94 },
  { name: "Sardorbek", username: "sardor_dev", avatar: "🚀", level: "B2", xp: 2450, rank: 3, testsCompleted: 54, accuracy: 91 },
  { name: "Fotima Karimova", username: "fotima_k", avatar: "🌟", level: "B1", xp: 1980, rank: 4, testsCompleted: 45, accuracy: 89 },
  { name: "Bobur Mirzo", username: "bobur_m", avatar: "🦅", level: "B1", xp: 1650, rank: 5, testsCompleted: 38, accuracy: 88 },
  { name: "Zuhra Yusupova", username: "zuhra_y", avatar: "👑", level: "A2", xp: 1240, rank: 6, testsCompleted: 29, accuracy: 85 },
  { name: "Diyorbek", username: "diyor_speed", avatar: "⚡", level: "A2", xp: 950, rank: 7, testsCompleted: 22, accuracy: 82 }
];

class LeaderboardManager {
  constructor() {
    this.leaders = this.loadLeaders();
  }

  loadLeaders() {
    try {
      const data = localStorage.getItem(STORAGE_LEADERBOARD);
      return data ? JSON.parse(data) : [...DEFAULT_LEADERS];
    } catch {
      return [...DEFAULT_LEADERS];
    }
  }

  saveLeaders() {
    try {
      localStorage.setItem(STORAGE_LEADERBOARD, JSON.stringify(this.leaders));
    } catch (e) {
      console.error(e);
    }
  }

  getRankings() {
    const currentUser = authManager.currentUser;
    let list = [...this.leaders];

    if (currentUser) {
      const existsIdx = list.findIndex(l => l.username === currentUser.username);
      const userItem = {
        name: currentUser.name || "Siz",
        username: currentUser.username,
        avatar: currentUser.avatar || "👨‍🎓",
        level: currentUser.level || "A1",
        xp: currentUser.xp || 0,
        testsCompleted: currentUser.testsCompleted || 0,
        accuracy: authManager.getAccuracy() || 0,
        isCurrent: true
      };

      if (existsIdx !== -1) {
        list[existsIdx] = userItem;
      } else {
        list.push(userItem);
      }
    }

    // Saralash: XP bo'yicha kamayish tartibida
    list.sort((a, b) => b.xp - a.xp);

    // O'rinlarni belgilash
    list = list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    return list;
  }

  getCurrentUserRank() {
    const list = this.getRankings();
    const currentUser = authManager.currentUser;
    if (!currentUser) return null;
    return list.find(item => item.username === currentUser.username) || null;
  }
}

export const leaderboardManager = new LeaderboardManager();
