-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id),
    referred_id UUID REFERENCES users(id),
    referral_code TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'active', 'expired')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON referrals(referral_code);

-- Add RLS policies
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own referrals
CREATE POLICY "Users can view own referrals"
ON referrals FOR SELECT
TO authenticated
USING (
    referrer_id = auth.uid() OR 
    referred_id = auth.uid()
);

-- Allow users to create referrals
CREATE POLICY "Users can create referrals"
ON referrals FOR INSERT
TO authenticated
WITH CHECK (referrer_id = auth.uid());

-- Allow system to update referral status
CREATE POLICY "System can update referral status"
ON referrals FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);