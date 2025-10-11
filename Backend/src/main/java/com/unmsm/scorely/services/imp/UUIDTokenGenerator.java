package com.unmsm.scorely.services.imp;

import com.unmsm.scorely.services.TokenGenerator;

import java.util.UUID;

public class UUIDTokenGenerator implements TokenGenerator {
    @Override
    public String generateToken() {
        return UUID.randomUUID().toString();
    }
}
