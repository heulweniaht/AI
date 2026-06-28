package com.healthcare.auth.util;

import java.security.SecureRandom;

public class PasswordUtil {

    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS    = "0123456789";
    private static final String SPECIAL   = "@#$!";
    private static final String ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL;

    private static final SecureRandom random = new SecureRandom();

    /**
     * Sinh mật khẩu ngẫu nhiên 10 ký tự, đảm bảo có ít nhất:
     * 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt.
     */
    public static String generateRandomPassword() {
        char[] password = new char[10];
        password[0] = UPPERCASE.charAt(random.nextInt(UPPERCASE.length()));
        password[1] = LOWERCASE.charAt(random.nextInt(LOWERCASE.length()));
        password[2] = DIGITS.charAt(random.nextInt(DIGITS.length()));
        password[3] = SPECIAL.charAt(random.nextInt(SPECIAL.length()));
        for (int i = 4; i < 10; i++) {
            password[i] = ALL_CHARS.charAt(random.nextInt(ALL_CHARS.length()));
        }
        // Shuffle để tránh pattern cố định
        for (int i = password.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char tmp = password[i]; password[i] = password[j]; password[j] = tmp;
        }
        return new String(password);
    }
}
