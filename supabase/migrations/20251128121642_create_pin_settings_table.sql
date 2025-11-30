/*
  # Create PIN Settings Table
  
  1. New Tables
    - `pin_settings`
      - `id` (uuid, primary key)
      - `pin_code` (text, the 4-digit PIN)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `pin_settings` table
    - Add policy to allow anonymous access (read-only) since this is a public app
*/

CREATE TABLE IF NOT EXISTS pin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_code text NOT NULL DEFAULT '8624',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to PIN settings"
  ON pin_settings
  FOR SELECT
  TO anon
  USING (true);

INSERT INTO pin_settings (pin_code, is_active) VALUES ('8624', true)
ON CONFLICT DO NOTHING;
