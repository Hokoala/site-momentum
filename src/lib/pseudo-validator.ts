/**
 * Utilitaire de validation des pseudos
 * - Filtre les mots inappropriés via @2toad/profanity
 * - Protection contre les injections XSS
 * - Validation des caractères autorisés
 */

import { Profanity, ProfanityOptions } from "@2toad/profanity";

// Configuration du filtre de profanité
const profanityOptions = new ProfanityOptions();
profanityOptions.wholeWord = false; // Détecte les mots même au milieu d'autres mots
profanityOptions.grawlix = "***";

const profanityFilter = new Profanity(profanityOptions);

// Liste étendue de mots inappropriés (français, anglais, leetspeak)
const ADDITIONAL_INAPPROPRIATE_WORDS: string[] = [
  // ===== FRANÇAIS =====
  // Insultes générales
  "merde", "putain", "connard", "connasse", "salope", "pute", "encule",
  "enculer", "enculé", "bite", "couille", "couilles", "nichon", "nichons",
  "chatte", "baiser", "niquer", "nique", "niker", "ntm", "fdp", "tg",
  "pd", "tapette", "gouine", "negre", "negro", "nègre", "bougnoule",
  "youpin", "feuj", "bamboula", "clochard", "batard", "bâtard", "bordel",
  "branler", "branleur", "branleuse", "branlette", "cul", "foutre",
  "gueule", "merdeux", "merdique", "petasse", "pétasse", "pouffiasse",
  "prostituee", "prostituée", "salaud", "sodomie", "sodomiser", "sucer",
  "suce", "teub", "zob", "zgeg", "tarlouze", "enflure", "bouffon",
  "abruti", "débile", "crétin", "imbécile", "idiot", "connerie",
  "saloperie", "ordure", "pourriture", "raclure", "fumier", "trouduc",
  "trou du cul", "naze", "tocard", "blaireau", "pignouf", "baltringue",
  "bolosse", "cassos", "crevard", "grognasse", "morue", "thon",
  "boudin", "cageot", "poissonnière",

  // Verlan et argot français
  "keuf", "meuf", "tepu", "teub", "ken", "péta", "relou", "chelou",
  "zarbi", "vener", "seum", "bail", "bicrave", "caillera", "racaille",
  "wesh", "zehma",

  // ===== ANGLAIS =====
  // Insultes principales
  "fuck", "fucking", "fucked", "fucker", "fucks", "motherfuck",
  "motherfucker", "motherfucking", "fuckhead", "fuckface", "fuckboy",
  "fuckgirl", "fucktard", "clusterfuck", "mindfuck", "brainfuck",
  "shit", "shitty", "shitter", "bullshit", "horseshit", "dipshit",
  "shithead", "shitface", "shitstorm", "apeshit", "batshit",
  "ass", "asshole", "asswipe", "asshat", "assface", "dumbass",
  "fatass", "jackass", "kickass", "badass", "smartass", "hardass",
  "bitch", "bitchy", "bitches", "sonofabitch", "bastard", "bastards",
  "dick", "dickhead", "dickface", "dickwad", "dickless", "dicksucker",
  "cock", "cockhead", "cocksucker", "cocky", "cockface",
  "pussy", "pussies", "cunt", "cunts", "twat", "twats",
  "whore", "whores", "slut", "sluts", "slutty", "skank", "skanky",
  "hoe", "hoes", "hooker", "hookers", "prostitute",

  // Insultes raciales/ethniques (à bloquer absolument)
  "nigger", "niggers", "nigga", "niggas", "nigg3r", "n1gger", "n1gga",
  "negro", "negros", "darkie", "coon", "coons", "spic", "spics",
  "wetback", "beaner", "chink", "chinks", "gook", "gooks", "jap",
  "japs", "kike", "kikes", "honky", "cracker", "crackers", "gringo",
  "paki", "pakis", "towelhead", "raghead", "sandnigger", "camel jockey",

  // Insultes homophobes
  "fag", "fags", "faggot", "faggots", "faggy", "homo", "homos",
  "dyke", "dykes", "lesbo", "lesbos", "queer", "queers", "tranny",
  "trannies", "shemale", "ladyboy",

  // Insultes sur le handicap
  "retard", "retarded", "retards", "tard", "tards", "spaz", "spazz",
  "cripple", "crippled", "mongoloid",

  // Termes sexuels explicites
  "penis", "penises", "vagina", "vaginas", "boob", "boobs", "boobie",
  "boobies", "tit", "tits", "titty", "titties", "nipple", "nipples",
  "dildo", "dildos", "vibrator", "buttplug", "fleshlight",
  "cum", "cumming", "cumshot", "jizz", "jizzed", "sperm", "semen",
  "wank", "wanker", "wanking", "jerkoff", "handjob", "blowjob",
  "rimjob", "footjob", "titjob", "boobjob", "anal", "analsex",
  "porn", "porno", "pornstar", "xxx", "xxxx", "nsfw", "milf",
  "gilf", "dilf", "bdsm", "bondage", "fetish", "hentai", "orgasm",
  "orgasms", "ejaculate", "ejaculation", "masturbate", "masturbation",
  "erection", "boner", "horny", "kinky", "nympho",

  // Violence et haine
  "kill", "killer", "killers", "murder", "murderer", "murders",
  "rape", "raper", "rapist", "raped", "raping", "molest", "molester",
  "pedophile", "paedophile", "pedo", "paedo", "childporn",
  "nazi", "nazis", "hitler", "heil", "swastika", "fascist", "fascism",
  "kkk", "klan", "whitesupremacy", "whitepower", "aryan",
  "terrorist", "terrorists", "terroriste", "jihad", "jihadist",
  "isis", "alqaeda", "taliban", "holocaust", "genocide", "ethnic cleansing",
  "suicide", "kys", "kms", "noose", "hang yourself",

  // ===== LEETSPEAK & VARIANTES AVEC CHIFFRES =====
  // F-word variantes
  "f0ck", "fuk", "fuc", "phuck", "phuk", "fck", "fvck", "fxck",
  "fu0k", "fook", "fukk", "fuq", "fuk", "f4ck", "fack",
  // S-word variantes
  "sh1t", "sh!t", "sht", "shiit", "shyt", "s4it", "5hit",
  // A-word variantes
  "a55", "a$$", "azz", "4ss", "4s5", "@ss", "@55",
  // B-word variantes
  "b1tch", "b!tch", "bi7ch", "bltch", "biatch", "beyotch",
  // C-word variantes
  "c0ck", "c0k", "kok", "kock", "c*ck", "d1ck", "d!ck", "dik",
  // D-word variantes
  "d1ck", "d!ck", "dik", "d1k", "dikk",
  // N-word variantes
  "n1gga", "n1gg4", "nigg4", "n1g", "niig", "nig", "niqa", "nikka",
  "n!gga", "n!gg@", "nigguh", "niglet",
  // P-word variantes
  "p0rn", "pr0n", "p*rn", "pusssy", "pu55y", "pu5sy", "pvssy",
  // Autres variantes leetspeak
  "f4g", "f4gg0t", "f@g", "f@ggot", "ph4g",
  "r3tard", "r3t4rd", "ret4rd",
  "h03", "h0e", "wh0re", "wh0r3", "5lut", "sl0t",
  "c0on", "k1ke", "sp1c",
  "p3n1s", "p3nis", "pen1s", "v4g1na", "vag1na",
  "b00b", "b00bs", "t1t", "t1ts", "t1tty",
  "s3x", "s3xy", "pr0n", "h3nta1", "h3ntai",

  // ===== ABRÉVIATIONS COMMUNES =====
  "wtf", "stfu", "gtfo", "lmfao", "lmao", "rofl",
  "omfg", "fml", "smh", "af", "thot", "thots",
  "simp", "simps", "incel", "incels", "cuck", "cucks",

  // ===== TERMES GAMING TOXIQUES =====
  "noob", "n00b", "newb", "scrub", "trash", "cancer",
  "autist", "autism", "downie", "mongo",
];

// Whitelist - mots qui pourraient être détectés par erreur mais sont OK
const WHITELIST_WORDS: string[] = [
  "bass", "class", "pass", "mass", "grass", "glass", "brass",
  "assassin", "classic", "assist", "associate", "passport",
  "scunthorpe", "arsenal", "penistone", "cockburn", "hancock",
  "dickens", "dickson", "hitchcock", "woodcock", "shuttlecock",
  "peacock", "cockatoo", "cockerel", "cocktail",
];

// Ajouter tous les mots au filtre
profanityFilter.addWords(ADDITIONAL_INAPPROPRIATE_WORDS);

// Ajouter la whitelist (mots autorisés malgré des faux positifs potentiels)
profanityFilter.whitelist.addWords(WHITELIST_WORDS);

// Caractères HTML/JS dangereux pour XSS
const XSS_PATTERNS: RegExp[] = [
  /<[^>]*>/,                       // Tags HTML
  /javascript:/i,                  // Protocol javascript
  /on\w+\s*=/i,                    // Event handlers (onclick=, onerror=, etc.)
  /script/i,                       // Script keyword
  /expression\s*\(/i,              // CSS expression()
  /url\s*\(/i,                     // CSS url()
  /&[#\w]+;/,                      // HTML entities
  /[<>"'`\\]/,                     // Caractères d'échappement dangereux
  /\{\{.*\}\}/,                    // Template injection {{}}
  /\$\{.*\}/,                      // Template literals ${}
];

export interface ValidationResult {
  isValid: boolean;
  sanitizedPseudo: string;
  errors: string[];
}

/**
 * Sanitise le pseudo en supprimant les caractères dangereux
 */
export function sanitizePseudo(pseudo: string): string {
  if (!pseudo) return "";

  // Trim et conversion en majuscules
  let sanitized = pseudo.trim().toUpperCase();

  // Supprimer tous les caractères non alphanumériques sauf underscore et tiret
  sanitized = sanitized.replace(/[^A-Z0-9_-]/g, "");

  // Limiter la longueur
  sanitized = sanitized.substring(0, 12);

  return sanitized;
}

/**
 * Vérifie si le pseudo contient des mots inappropriés via @2toad/profanity
 */
export function containsInappropriateWords(pseudo: string): boolean {
  // Normaliser pour détecter le leetspeak
  const normalizedPseudo = pseudo.toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/[\s_-]/g, "");

  // Vérifier avec la lib et la version normalisée
  return profanityFilter.exists(pseudo) || profanityFilter.exists(normalizedPseudo);
}

/**
 * Vérifie si le pseudo contient des tentatives XSS
 */
export function containsXSSAttempt(pseudo: string): boolean {
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(pseudo)) {
      return true;
    }
  }
  return false;
}

/**
 * Vérifie si le pseudo contient des patterns suspects
 */
export function containsSuspiciousPatterns(pseudo: string): string[] {
  const issues: string[] = [];

  // Vérifier la répétition excessive de caractères
  if (/(.)\1{3,}/i.test(pseudo)) {
    issues.push("REPEATED_CHARACTERS");
  }

  // Vérifier les caractères non autorisés
  if (/[^a-zA-Z0-9_-]/.test(pseudo)) {
    issues.push("INVALID_CHARACTERS");
  }

  return issues;
}

/**
 * Validation complète du pseudo
 */
export function validatePseudo(pseudo: string): ValidationResult {
  const errors: string[] = [];

  // Vérification de base
  if (!pseudo || pseudo.trim().length === 0) {
    return {
      isValid: false,
      sanitizedPseudo: "",
      errors: ["PSEUDO_REQUIRED"],
    };
  }

  const trimmedPseudo = pseudo.trim();

  // Vérifier XSS en premier (sur le pseudo original)
  if (containsXSSAttempt(trimmedPseudo)) {
    return {
      isValid: false,
      sanitizedPseudo: "",
      errors: ["SECURITY_VIOLATION"],
    };
  }

  // Sanitiser le pseudo
  const sanitizedPseudo = sanitizePseudo(trimmedPseudo);

  // Vérifier la longueur après sanitisation
  if (sanitizedPseudo.length < 3) {
    errors.push("PSEUDO_TOO_SHORT");
  }

  if (sanitizedPseudo.length > 12) {
    errors.push("PSEUDO_TOO_LONG");
  }

  // Vérifier les mots inappropriés avec @2toad/profanity
  if (containsInappropriateWords(sanitizedPseudo)) {
    errors.push("INAPPROPRIATE_CONTENT");
  }

  // Vérifier les patterns suspects
  const suspiciousPatterns = containsSuspiciousPatterns(sanitizedPseudo);
  errors.push(...suspiciousPatterns);

  return {
    isValid: errors.length === 0,
    sanitizedPseudo,
    errors,
  };
}

/**
 * Messages d'erreur localisés
 */
export const ERROR_MESSAGES: Record<string, { fr: string; en: string }> = {
  PSEUDO_REQUIRED: {
    fr: "Le pseudo est requis",
    en: "Username is required",
  },
  PSEUDO_TOO_SHORT: {
    fr: "Le pseudo doit contenir au moins 3 caractères",
    en: "Username must be at least 3 characters",
  },
  PSEUDO_TOO_LONG: {
    fr: "Le pseudo ne doit pas dépasser 12 caractères",
    en: "Username must not exceed 12 characters",
  },
  INAPPROPRIATE_CONTENT: {
    fr: "Le pseudo contient du contenu inapproprié",
    en: "Username contains inappropriate content",
  },
  SECURITY_VIOLATION: {
    fr: "Caractères non autorisés détectés",
    en: "Unauthorized characters detected",
  },
  REPEATED_CHARACTERS: {
    fr: "Trop de caractères répétés",
    en: "Too many repeated characters",
  },
  INVALID_CHARACTERS: {
    fr: "Seuls les lettres, chiffres, tirets et underscores sont autorisés",
    en: "Only letters, numbers, dashes and underscores are allowed",
  },
};

/**
 * Obtenir le message d'erreur formaté
 */
export function getErrorMessage(errorCode: string, lang: "fr" | "en" = "en"): string {
  return ERROR_MESSAGES[errorCode]?.[lang] || errorCode;
}
