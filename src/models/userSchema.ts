import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userValidation = {
  name: {
    minLength: 2,
    maxLength: 50,
    messages: {
      required: "Name is required",
      min: "Name must be at least 2 characters",
      max: "Name cannot exceed 50 characters",
      invalid: "Please provide a valid name",
    },
  },
  email: {
    messages: {
      required: "Email is required",
      invalid: "Please provide a valid email",
    },
  },
  password: {
    minLength: 6,
    maxLength: 100,
    messages: {
      required: "Password is required",
      min: "Password must be at least 6 characters",
      max: "Password cannot exceed 100 characters",
      invalid: "Please provide a valid password",
    },
  },
  avatar: {
    default: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Aneka",
    messages: {
      required: "Avatar is required",
      invalid: "Please provide a valid URL for avatar",
    },
  },
  role: {
    enum: ["user", "admin"] as const,
    default: "user",
    messages: {
      required: "Role is required",
      invalid: "Role must be either 'user', or 'admin'",
    },
  },
  bio: {
    maxLength: 500,
    messages: {
      max: "Bio cannot exceed 500 characters",
      invalid: "Please provide a valid bio",
    },
  },
  location: {
    messages: {
      invalid: "Please provide a valid location",
    },
  },
  website: {
    messages: {
      invalid: "Please provide a valid website URL",
    },
  },
  socialLinks: {
    messages: {
      invalid: "Please provide valid social media URLs",
    },
  },
  preferences: {
    theme: {
      enum: ["light", "dark", "system"] as const,
      default: "system",
      messages: {
        required: "Theme preference is required",
        invalid: "Theme must be either 'light', 'dark', or 'system'",
      },
    },
    notifications: {
      enum: ["all", "important", "none"] as const,
      default: "all",
      messages: {
        required: "Notification preference is required",
        invalid: "Notifications must be either 'all', 'important', or 'none'",
      },
    },
    language: {
      enum: ["en", "es", "fr", "de", "zh"] as const,
      default: "en",
      messages: {
        required: "Language preference is required",
        invalid: "Please select a valid language",
      },
    },
  },
} as const;

export const userZodSchema = z.object({
  name: z
    .string({
      required_error: userValidation.name.messages.required,
      invalid_type_error: userValidation.name.messages.invalid,
    })
    .min(userValidation.name.minLength, userValidation.name.messages.min)
    .max(userValidation.name.maxLength, userValidation.name.messages.max)
    .default(
      [
        "Sir Quacksalot",
        "Captain Noodles",
        "Lord Fluffington",
        "Doctor Giggles",
        "Princess Sparklepants",
      ][Math.floor(Math.random() * 5)]
    ),
  email: z
    .string({
      required_error: userValidation.email.messages.required,
      invalid_type_error: userValidation.email.messages.invalid,
    })
    .email(userValidation.email.messages.invalid),
  password: z
    .string({
      required_error: userValidation.password.messages.required,
      invalid_type_error: userValidation.password.messages.invalid,
    })
    .min(
      userValidation.password.minLength,
      userValidation.password.messages.min
    )
    .max(
      userValidation.password.maxLength,
      userValidation.password.messages.max
    ),
  avatar: z
    .string({
      required_error: userValidation.avatar.messages.required,
      invalid_type_error: userValidation.avatar.messages.invalid,
    })
    .url(userValidation.avatar.messages.invalid)
    .default(userValidation.avatar.default),
  role: z
    .enum(userValidation.role.enum, {
      required_error: userValidation.role.messages.required,
      invalid_type_error: userValidation.role.messages.invalid,
    })
    .default(userValidation.role.default),
  bio: z
    .string({ invalid_type_error: userValidation.bio.messages.invalid })
    .max(userValidation.bio.maxLength, userValidation.bio.messages.max)
    .optional(),
  location: z
    .string({ invalid_type_error: userValidation.location.messages.invalid })
    .optional(),
  website: z
    .string({ invalid_type_error: userValidation.website.messages.invalid })
    .url(userValidation.website.messages.invalid)
    .optional(),
  socialLinks: z
    .object({
      twitter: z
        .string()
        .url(userValidation.socialLinks.messages.invalid)
        .optional(),
      linkedin: z
        .string()
        .url(userValidation.socialLinks.messages.invalid)
        .optional(),
      github: z
        .string()
        .url(userValidation.socialLinks.messages.invalid)
        .optional(),
    })
    .optional(),
  preferences: z
    .object({
      theme: z
        .enum(userValidation.preferences.theme.enum, {
          required_error: userValidation.preferences.theme.messages.required,
          invalid_type_error: userValidation.preferences.theme.messages.invalid,
        })
        .default(userValidation.preferences.theme.default),
      notifications: z
        .enum(userValidation.preferences.notifications.enum, {
          required_error:
            userValidation.preferences.notifications.messages.required,
          invalid_type_error:
            userValidation.preferences.notifications.messages.invalid,
        })
        .default(userValidation.preferences.notifications.default),
      language: z
        .enum(userValidation.preferences.language.enum, {
          required_error: userValidation.preferences.language.messages.required,
          invalid_type_error:
            userValidation.preferences.language.messages.invalid,
        })
        .default(userValidation.preferences.language.default),
    })
    .default({
      theme: userValidation.preferences.theme.default,
      notifications: userValidation.preferences.notifications.default,
      language: userValidation.preferences.language.default,
    }),
  isVerified: z.boolean().default(false),
  lastLogin: z.date().optional(),
  loginHistory: z
    .array(
      z.object({
        timestamp: z.date(),
        ip: z.string(),
        device: z.string(),
        location: z.string().optional(),
      })
    )
    .optional(),
});

export const userLoginZodSchema = userZodSchema.pick({
  email: true,
  password: true,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, userValidation.name.messages.required],
      trim: true,
      minlength: [
        userValidation.name.minLength,
        userValidation.name.messages.min,
      ],
      maxlength: [
        userValidation.name.maxLength,
        userValidation.name.messages.max,
      ],
    },
    email: {
      type: String,
      required: [true, userValidation.email.messages.required],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    avatar: {
      type: String,
      default: userValidation.avatar.default,
    },
    role: {
      type: String,
      enum: userValidation.role.enum,
      default: userValidation.role.default,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: String,
    website: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
    },
    preferences: {
      theme: {
        type: String,
        enum: userValidation.preferences.theme.enum,
        default: userValidation.preferences.theme.default,
      },
      notifications: {
        type: String,
        enum: userValidation.preferences.notifications.enum,
        default: userValidation.preferences.notifications.default,
      },
      language: {
        type: String,
        enum: userValidation.preferences.language.enum,
        default: userValidation.preferences.language.default,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
    loginHistory: [
      {
        timestamp: Date,
        ip: String,
        device: String,
        location: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: "user" | "admin";
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: "all" | "important" | "none";
    language: "en" | "es" | "fr" | "de" | "zh";
  };
  isVerified: boolean;
  lastLogin?: Date;
  loginHistory?: Array<{
    timestamp: Date;
    ip: string;
    device: string;
    location?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;
