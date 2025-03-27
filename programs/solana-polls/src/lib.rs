use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_polls {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        name: String,
        description: String,
    ) -> Result<()> {
        let event = &mut ctx.accounts.event;
        event.authority = ctx.accounts.authority.key();
        event.name = name;
        event.description = description;
        event.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn create_session(
        ctx: Context<CreateSession>,
        name: String,
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        let session = &mut ctx.accounts.session;
        session.name = name;
        session.start_time = start_time;
        session.end_time = end_time;
        session.event = ctx.accounts.event.key();
        session.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn sign_presence(ctx: Context<SignPresence>) -> Result<()> {
        let presence = &mut ctx.accounts.presence;
        presence.session = ctx.accounts.session.key();
        presence.student = ctx.accounts.student.key();
        presence.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateEvent<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + name.len() + 4 + 100 + 8,
        seeds = [b"event", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateSession<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 4 + name.len() + 8 + 8 + 32 + 8,
        seeds = [b"session", event.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub session: Account<'info, Session>,
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SignPresence<'info> {
    #[account(
        init,
        payer = student,
        space = 8 + 32 + 32 + 8,
        seeds = [b"presence", session.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub presence: Account<'info, Presence>,
    pub session: Account<'info, Session>,
    #[account(mut)]
    pub student: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Event {
    pub authority: Pubkey,
    pub name: String,
    pub description: String,
    pub created_at: i64,
}

#[account]
pub struct Session {
    pub name: String,
    pub start_time: i64,
    pub end_time: i64,
    pub event: Pubkey,
    pub created_at: i64,
}

#[account]
pub struct Presence {
    pub session: Pubkey,
    pub student: Pubkey,
    pub created_at: i64,
} 